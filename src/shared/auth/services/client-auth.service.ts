import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { OAuthProvider } from '../enums/oauth.enum';
import { RequestResetTokenDto } from '../dtos/web/request-reset-token.dto';
import { MailService } from 'src/shared/mail/services/mail.service';
import { UserNotFoundException } from 'src/shared/abstract-user-management/errors/user/user.notfound.error';
import { ResponseResetTokenDto } from '../dtos/web/response-reset-token.dto';
import { ResponseCheckResetTokenDto } from '../dtos/web/response-check-reset-token.dto';
import { RequestCheckResetTokenDto } from '../dtos/web/request-check-reset-token.dto';
import { ForgetPasswordTemplateProps } from 'src/assets/templates/forget-password/type';
import { VerifyEmailTemplateProps } from 'src/assets/templates/verify-email/type';
import { identifyUser } from 'src/shared/abstract-user-management/utils/identify-user';
import { ResponseClientSigninDto } from '../dtos/client/response-client-signin.dto';
import { ResponseClientSignupDto } from '../dtos/client/response-client-signup.dto';
import { BasicRoles } from 'src/shared/abstract-user-management/enums/basic-roles.enum';
import { AuthNotActiveException } from 'src/shared/auth/errors/auth.notactive.error';
import { CreateAbstractUserDto } from 'src/shared/abstract-user-management/dtos/abstract-user/create-abstract-user.dto';
import { ResponseAbstractUserDto } from 'src/shared/abstract-user-management/dtos/abstract-user/response-abstract-user.dto';
import { UserRepository } from 'src/modules/users/repositories/user.repository';
import { UserService } from 'src/modules/users/services/user.service';
import { ConfigurationNamespaceService } from 'src/shared/configurations/services/configuration-namespace.service';
import { ConfigurationNamespaces } from 'src/app/enums/configuration-namespaces.enum';
import { StorageService } from 'src/shared/storage/services/storage.service';
import { buildStaticUrl } from 'src/shared/helpers/url.utils';
import { STORAGE_SYSTEMATICS } from 'src/app/constants/storage-systematics.constants';
import { DeepPartial } from 'typeorm';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { AuthProvidersService } from './auth-provider.service';

@Injectable()
export class ClientAuthService {
  private readonly logger = new Logger(ClientAuthService.name);

  constructor(
    protected readonly userRepository: UserRepository,
    protected readonly userService: UserService,
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    protected readonly mailService: MailService,
    protected readonly storageService: StorageService,
    protected readonly configurationNamespaceService: ConfigurationNamespaceService,
    protected readonly authProvidersService?: AuthProvidersService,
  ) {}

  private async generateTokens(id?: string, email?: string) {
    const payload = { sub: id, email: email };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('app.jwt.secret'),
      expiresIn: this.configService.get('app.jwt.accessExpiration'),
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('app.jwt.secret'),
      expiresIn: this.configService.get('app.jwt.refreshExpiration'),
    });

    return { access_token, refresh_token };
  }

  async signin(
    email: string,
    password: string,
  ): Promise<ResponseClientSigninDto> {
    const user = await this.userRepository.findOne({
      where: [{ email: email }],
    });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    if (!user.password) {
      throw new UnauthorizedException('User does not have a password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new AuthNotActiveException();
    }

    const { access_token, refresh_token } = await this.generateTokens(
      user.id,
      user.email,
    );

    return {
      user,
      access_token,
      refresh_token,
    };
  }

  async signup(
    createUserDto: CreateAbstractUserDto,
  ): Promise<ResponseClientSignupDto> {
    return {
      user: await this.userService.save({
        ...createUserDto,
        roleId: BasicRoles.User,
      }),
    };
  }

  async refreshToken(refreshToken: string): Promise<ResponseClientSigninDto> {
    try {
      const payload: { sub: string; email: string } =
        await this.jwtService.verifyAsync(refreshToken, {
          secret: this.configService.get('app.jwt.secret'),
        });

      const user = await this.userRepository.findOneById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }

      const { access_token, refresh_token } = await this.generateTokens(
        user.id,
        user.email,
      );

      return {
        user,
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException(
        `Invalid or expired refresh token ${error}`,
      );
    }
  }

  private async downloadProfilePicture(
    pictureUrl: string,
  ): Promise<number | null> {
    try {
      const response = await fetch(pictureUrl);
      if (!response.ok) {
        this.logger.warn(
          `Failed to download profile picture: HTTP ${response.status}`,
        );
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length === 0) {
        this.logger.warn('Profile picture download returned empty buffer');
        return null;
      }

      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const extension = contentType.split('/')[1]?.split(';')[0] || 'jpg';

      const multerFile: Express.Multer.File = {
        buffer,
        originalname: `ipp-${Date.now()}.${extension}`,
        mimetype: contentType,
        size: buffer.length,
        fieldname: 'file',
        encoding: '7bit',
        stream: null as unknown as Express.Multer.File['stream'],
        destination: '',
        filename: '',
        path: '',
      };

      // Store as non-temporary and non-private (profile pictures are public)
      const storageEntity = await this.storageService.store(
        multerFile,
        false,
        false,
      );

      return storageEntity.id;
    } catch (error) {
      this.logger.warn(`Failed to import profile picture: ${error}`);
      return null;
    }
  }

  async handleOAuth(
    provider: OAuthProvider,
    idToken: string,
    redirectUri?: string,
    codeVerifier?: string,
  ): Promise<{
    user?: ResponseAbstractUserDto;
    access_token: string;
    refresh_token: string;
  }> {
    let newUser: DeepPartial<UserEntity> = {};
    let pictureUrl: string | undefined;

    if (provider === OAuthProvider.GOOGLE) {
      const data = await this.authProvidersService?.googleOAuth(
        idToken,
        codeVerifier,
        redirectUri,
      );
      newUser.email = data?.email as string;
      newUser.firstName = data?.given_name;
      newUser.lastName = data?.family_name;
      newUser.username = data?.email?.split('@')[0];
      pictureUrl = data?.picture;
    } else if (provider == OAuthProvider.GITHUB) {
      const data = await this.authProvidersService?.githubOAuth(idToken);
      newUser.email = data?.email as string;
      newUser.username = data?.username.toLowerCase();
    } else if (provider == OAuthProvider.LINKEDIN) {
      const data = await this.authProvidersService?.linkedinOauth(
        idToken,
        redirectUri,
      );
      newUser.email = data?.email as string;
      newUser.username = data?.username;
      pictureUrl = data?.picture;
    } else if (provider == OAuthProvider.APPLE) {
      const decoded: { email?: string; sub?: string } | null =
        this.jwtService.decode(idToken);
      newUser.email = decoded?.email;
      newUser.username = decoded?.email?.split('@')[0] || decoded?.sub;
    } else {
      throw new UnauthorizedException('Unsupported OAuth provider');
    }

    if (!newUser.email || !newUser.username) {
      throw new UnauthorizedException(
        'Could not retrieve valid email or username from provider',
      );
    }

    const userByEmail = await this.userService.findOneByEmail(
      newUser.email,
      true,
    );
    const userByUsername = await this.userService.findOneByUsername(
      newUser.username,
      true,
    );

    if (!userByEmail && !userByUsername) {
      // Download profile picture for new users only
      let pictureId: number | undefined;
      if (pictureUrl) {
        const downloadedPictureId =
          await this.downloadProfilePicture(pictureUrl);
        if (downloadedPictureId) {
          pictureId = downloadedPictureId;
        }
      }

      newUser = await this.userService.extendedSave({
        email: newUser.email,
        username: newUser.username.toLowerCase().replace(/\s/g, '_'),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        roleId: BasicRoles.User,
        isActive: true,
        source: provider,
        pictureId,
      });
    } else if (userByEmail) {
      if (userByEmail.deletedAt) {
        await this.userService.restore(userByEmail.id);
        userByEmail.deletedAt = undefined;
      }
      newUser = userByEmail as UserEntity;
    } else {
      if (userByUsername?.deletedAt) {
        await this.userService.restore(userByUsername.id);
        userByUsername.deletedAt = undefined;
      }
      newUser = userByUsername as UserEntity;
    }

    const { access_token, refresh_token } = await this.generateTokens(
      newUser?.id,
      newUser?.email,
    );

    return {
      user: newUser as ResponseAbstractUserDto,
      access_token,
      refresh_token,
    };
  }

  async sendEmailVerification(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    try {
      const verifyToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        {
          secret: this.configService.get('app.jwt.secret'),
          expiresIn: '15m',
        },
      );

      const host = this.configService.get<string | null>('app.http.host') || '';
      const port = this.configService.get<number>('app.http.port') || 80;
      const secure = this.configService.get<boolean>('app.http.secure');
      const url = buildStaticUrl(host, port, secure);
      const verifyLink = `${url}/api/client-auth/verify-email?token=${verifyToken}`;

      const name =
        ((await this.configurationNamespaceService.getSpecificParam(
          ConfigurationNamespaces.CORE,
          'company.name',
        )) as string) || 'Our App';
      const address =
        ((await this.configurationNamespaceService.getSpecificParam(
          ConfigurationNamespaces.CORE,
          'company.address',
        )) as string) || 'N/A';
      const support =
        ((await this.configurationNamespaceService.getSpecificParam(
          ConfigurationNamespaces.CORE,
          'company.support',
        )) as string) || 'N/A';

      const applicationLogo = await this.storageService.findBySystematicName(
        STORAGE_SYSTEMATICS.APPLICATION_LOGO,
      );

      await this.mailService.sendTemplate<VerifyEmailTemplateProps>(
        user.email,
        `Verify your email address - ${name}`,
        'verify-email',
        {
          name,
          address,
          support,
          logo: `${url}/api/storage/resource/${applicationLogo?.slug}`,
          client: identifyUser(user),
          email: user.email,
          url: verifyLink,
        },
      );

      return { email: user.email, success: true };
    } catch (error) {
      console.error('Error sending verify email:', error);
      return { email: user.email, success: false };
    }
  }

  async verifyEmail(token: string) {
    try {
      const payload: { sub: string; email: string } =
        await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('app.jwt.secret'),
        });

      const user = await this.userRepository.findOne({
        where: [{ id: payload.sub }],
      });
      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }

      await this.userRepository.update(user.id, { emailVerified: new Date() });

      let url: string;
      const mobileScheme = this.configService.get('app.mobile.scheme');

      if (mobileScheme === 'exp') {
        const mobileHost = this.configService.get('app.mobile.host');
        const mobilePort = this.configService.get('app.mobile.port');
        url = `exp://${mobileHost}:${mobilePort}/--/main/account/email-success?verifyToken=${encodeURIComponent(
          token,
        )}`;
      } else {
        url = `${mobileScheme}/--/main/account/email-success?verifyToken=${encodeURIComponent(
          token,
        )}`;
      }

      return url;
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired verify token ' + error,
      );
    }
  }

  async requestResetToken(
    requestResetTokenDto: RequestResetTokenDto,
  ): Promise<ResponseResetTokenDto> {
    const user = await this.userService.findOneByUsernameOrEmail(
      requestResetTokenDto.usernameOrEmail,
    );
    if (!user) {
      throw new UserNotFoundException();
    }
    try {
      const resetToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        {
          secret: this.configService.get('app.passwordReset.secret'),
          expiresIn: this.configService.get('app.passwordReset.expiration'),
        },
      );

      const webAppUrl = this.configService.get('app.webAppUrl');
      const resetLink = `${webAppUrl}?token=${resetToken}`;

      //gather informations

      await this.mailService.sendTemplate<ForgetPasswordTemplateProps>(
        user.email,
        'Password Reset Request',
        'forget-password',
        {
          name:
            ((await this.configurationNamespaceService.getSpecificParam(
              ConfigurationNamespaces.CORE,
              'company.name',
            )) as string) || 'Our App',
          address:
            ((await this.configurationNamespaceService.getSpecificParam(
              ConfigurationNamespaces.CORE,
              'company.address',
            )) as string) || 'N/A',
          support:
            ((await this.configurationNamespaceService.getSpecificParam(
              ConfigurationNamespaces.CORE,
              'company.support',
            )) as string) || 'N/A',
          logo: `${this.configService.get<string>('app.webAppUrl')}/logo.png`,
          client: identifyUser(user),
          email: user.email,
          url: resetLink,
        },
      );
      return { email: user.email, success: true };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { email: user.email, success: false };
    }
  }

  async checkRestTokenValidity(
    requestCheckResetTokenDto: RequestCheckResetTokenDto,
  ): Promise<ResponseCheckResetTokenDto> {
    try {
      const payload: { sub: string; email: string } =
        await this.jwtService.verifyAsync(requestCheckResetTokenDto.token, {
          secret: this.configService.get('app.passwordReset.secret'),
        });

      const user = await this.userRepository.findOneById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }

      return {
        token: requestCheckResetTokenDto.token,
        valid: true,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired reset token' + error);
    }
  }
}
