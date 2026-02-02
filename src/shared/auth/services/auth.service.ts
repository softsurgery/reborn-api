import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ResponseSigninDto } from '../dtos/web/response-signin.dto';
import { RequestResetTokenDto } from '../dtos/web/request-reset-token.dto';
import { MailService } from 'src/shared/mail/services/mail.service';
import { UserNotFoundException } from 'src/shared/abstract-user-management/errors/user/user.notfound.error';
import { ResponseResetTokenDto } from '../dtos/web/response-reset-token.dto';
import { ResponseCheckResetTokenDto } from '../dtos/web/response-check-reset-token.dto';
import { RequestCheckResetTokenDto } from '../dtos/web/request-check-reset-token.dto';
import { StoreService } from 'src/shared/store/services/store.service';
import { GenericStore } from 'src/shared/store/interfaces/generic-store.interface';
import { ForgetPasswordTemplateProps } from 'src/assets/templates/forget-password/type';
import { identifyUser } from 'src/shared/abstract-user-management/utils/identify-user';
import { AuthNotActiveException } from 'src/shared/auth/errors/auth.notactive.error';
import { StoreIDs } from 'src/app/enums/store.enum';
import { OAuthProvider } from '../enums/oauth.enum';
import { ResponseAbstractUserDto } from 'src/shared/abstract-user-management/dtos/abstract-user/response-abstract-user.dto';
import { OAuth2Client } from 'google-auth-library';
import {
  GithubEmail,
  GithubUserResponse,
} from '../interfaces/github.interface';
import { UserRepository } from 'src/modules/users/repositories/user.repository';
import { Core } from 'src/app/interface/core.interface';
import { UserService } from 'src/modules/users/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly storeService: StoreService,
    private userRepository: UserRepository,
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
    usernameOrEmail: string,
    password: string,
  ): Promise<ResponseSigninDto> {
    const user = await this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
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

    if (!user.isApproved) {
      throw new UnauthorizedException('User not approved');
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

  async refreshToken(refreshToken: string): Promise<ResponseSigninDto> {
    try {
      const payload: { sub: string; email: string } =
        await this.jwtService.verifyAsync(refreshToken, {
          secret: this.configService.get('app.jwtRefreshTokenSecret'),
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

  async handleOAuth(
    provider: OAuthProvider,
    idToken: string,
  ): Promise<{
    user?: ResponseAbstractUserDto;
    access_token: string;
    refresh_token: string;
  }> {
    let email: string | undefined | null;
    let username: string | undefined;

    if (provider == OAuthProvider.GOOGLE) {
      const client = new OAuth2Client(process.env.GOOGLE_ID);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_ID,
      });
      const payload = ticket.getPayload();
      email = payload?.email;
      username = payload?.name || payload?.email?.split('@')[0];
    } else if (provider == OAuthProvider.GITHUB) {
      const userResponse: GithubUserResponse = await fetch(
        'https://api.github.com/user',
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      ).then((res) => res.json());

      email = userResponse.email;
      username = userResponse.login;

      email = userResponse.email;
      username = userResponse.login;

      if (!email) {
        const emails: GithubEmail[] = await fetch(
          'https://api.github.com/user/emails',
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          },
        ).then((res) => res.json());

        // Find the primary & verified email
        const primary = emails.find((e) => e.primary && e.verified);
        email = primary?.email || undefined;
      }
    } else {
      throw new UnauthorizedException('Unsupported OAuth provider');
    }

    if (!email || !username) {
      throw new UnauthorizedException(
        'Could not retrieve valid email or username from provider',
      );
    }

    const user = await this.userService.save({
      email,
      username,
      isApproved: false,
    });

    const { access_token, refresh_token } = await this.generateTokens(
      user?.id,
      user?.email,
    );

    return {
      user,
      access_token,
      refresh_token,
    };
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
      const webAppUrl: string =
        this.configService.get<string>('app.webAppUrl') ?? '';
      const resetLink = `${webAppUrl}?token=${resetToken}`;

      //gather informations
      const core = (await this.storeService.findOneById(
        StoreIDs.CORE,
      )) as GenericStore<Core>;

      await this.mailService.sendTemplate<ForgetPasswordTemplateProps>(
        user.email,
        'Password Reset Request',
        'forget-password',
        {
          name: core.value.name,
          address: core.value.address,
          support: core.value.support,
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
