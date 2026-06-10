import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Request,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../utils/public-strategy';
import { ResponseSigninDto } from '../dtos/web/response-signin.dto';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { ClientAuthService } from '../services/client-auth.service';
import { RequestClientSignUpDto } from '../dtos/client/request-client-signup.dto';
import { ResponseClientSignupDto } from '../dtos/client/response-client-signup.dto';
import { RequestClientSignInDto } from '../dtos/client/request-client-signin.dto';
import { ResponseClientSigninDto } from '../dtos/client/response-client-signin.dto';
import { RefreshTokenDto } from '../dtos/web/response-refresh-token';
import { Notify } from 'src/shared/notifications/decorators/notify.decorator';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { NotificationInterceptor } from 'src/shared/notifications/decorators/notification.interceptor';
import { identifyUser } from 'src/shared/abstract-user-management/utils/identify-user';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { Response } from 'express';
import { RequestClientOAuthDto } from '../dtos/client/request-client-oauth.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('client-auth')
@Controller({ version: '1', path: '/client-auth' })
@UseInterceptors(LogInterceptor)
@UseInterceptors(NotificationInterceptor)
export class ClientAuthController {
  constructor(
    private clientAuthService: ClientAuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post('sign-in')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Sign in a client user',
    description: 'Authenticate a client user with email and password.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful sign in.',
    type: ResponseSigninDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @LogEvent(EventType.CLIENT_SIGNIN)
  @Notify(NotificationType.NEW_SIGNIN)
  async signIn(
    @Body() signInDto: RequestClientSignInDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseSigninDto> {
    const result = await this.clientAuthService.signin(
      signInDto.email,
      signInDto.password,
    );
    req.logInfo = {
      userId: result.user.id,
      clientName: identifyUser(result.user as AbstractUserEntity),
    };
    req.notificationInfo = {
      userId: result.user.id,
      clientName: identifyUser(result.user as AbstractUserEntity),
    };
    return result;
  }

  @Public()
  @Post('oauth')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Handle OAuth SSO sign-in/signup',
    description:
      'Accepts an ID token or access token from a supported OAuth provider (Google, LinkedIn, Apple) and signs in or registers the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful OAuth sign in or registration.',
    type: ResponseClientSigninDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Missing or invalid OAuth data.',
  })
  @LogEvent(EventType.CLIENT_SIGNIN)
  @Notify(NotificationType.NEW_SIGNIN)
  async oauth(
    @Body() oauthDto: RequestClientOAuthDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseClientSigninDto> {
    const result = await this.clientAuthService.handleOAuth(
      oauthDto.provider,
      oauthDto.idToken,
      oauthDto.redirectUri,
      oauthDto.codeVerifier,
    );
    if (result.user) {
      req.logInfo = {
        userId: result.user.id,
        clientName: identifyUser(result.user as AbstractUserEntity),
      };
      req.notificationInfo = {
        userId: result.user.id,
        clientName: identifyUser(result.user as AbstractUserEntity),
      };
    }
    return result as ResponseClientSigninDto;
  }

  @Public()
  @Get('oauth/redirect')
  @ApiOperation({
    summary: 'OAuth redirect handler',
    description: 'Redirects OAuth response back to the mobile app.',
  })
  redirect(@Query() query: Record<string, string>, @Res() res: Response) {
    let url: string;
    const mobileScheme = this.configService.get('app.mobile.scheme');

    const queryString = new URLSearchParams(query).toString();

    if (mobileScheme === 'exp') {
      const mobileHost = this.configService.get('app.mobile.host');
      const mobilePort = this.configService.get('app.mobile.port');
      url = `exp://${mobileHost}:${mobilePort}/--/oauth?${queryString}`;
    } else {
      url = `${mobileScheme}/--/oauth?${queryString}`;
    }

    return res.redirect(url);
  }

  @Public()
  @Post('sign-up')
  @ApiOperation({
    summary: 'Register a new client user',
    description:
      'Create a new client user account with username, email, and password.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    type: ResponseClientSignupDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @LogEvent(EventType.CLIENT_SIGNUP)
  async register(
    @Body() registerDto: RequestClientSignUpDto,
    @Request() req: AdvancedRequest,
  ) {
    try {
      const result = await this.clientAuthService.signup(registerDto);
      req.logInfo = {
        userId: result.user?.id,
        clientName: identifyUser(result.user as AbstractUserEntity),
      };
      return result;
    } catch (error) {
      throw new BadRequestException(`User registration failed: ${error}`);
    }
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Obtain a new access token using a valid refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token successfully refreshed.',
    type: ResponseClientSigninDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token.',
  })
  async refreshToken(
    @Body() body: RefreshTokenDto,
  ): Promise<ResponseClientSigninDto> {
    return this.clientAuthService.refreshToken(body.refresh_token);
  }

  @Public()
  @Post('send-verify-email')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Send verification email',
    description: 'Send an email with a verification link.',
  })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully.',
  })
  async sendVerifyEmail(@Body() body: { email: string }) {
    return this.clientAuthService.sendEmailVerification(body.email);
  }

  @Public()
  @Get('verify-email')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Verify email',
    description: 'Verify user email with the provided token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully.',
  })
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    return res.redirect(await this.clientAuthService.verifyEmail(token));
  }
}
