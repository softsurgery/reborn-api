import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user-management/services/user.service';
import * as bcrypt from 'bcrypt';
import { ResponseSigninDto } from '../dtos/response-signin.dto';
import { CreateUserDto } from 'src/modules/user-management/dtos/user/create-user.dto';
import { ResponseSignupDto } from '../dtos/response-signup.dto';
import { OAuth2Client } from 'google-auth-library';
import { ResponseUserDto } from 'src/modules/user-management/dtos/user/response-user.dto';
import {
  GithubEmail,
  GithubUserResponse,
} from '../interfaces/github.interface';
import { OAuthProvider } from '../enums/oauth.enum';
import { UserRepository } from 'src/modules/user-management/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async generateTokens(id: string, email: string) {
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

  async signup(createUserDto: CreateUserDto): Promise<ResponseSignupDto> {
    return {
      user: await this.userService.save({
        ...createUserDto,
        isApproved: false,
      }),
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
    user: ResponseUserDto;
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
      user.id,
      user.email,
    );

    return {
      user,
      access_token,
      refresh_token,
    };
  }
}
