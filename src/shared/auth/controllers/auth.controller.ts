import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../utils/public-strategy';
import { AuthService } from '../services/auth.service';
import { RefreshTokenDto } from '../dtos/web/response-refresh-token';
import { ResponseSigninDto } from '../dtos/web/response-signin.dto';
import { RequestSignInDto } from '../dtos/web/request-signin.dto';
import { OAuthRequestDto } from '../dtos/web/response-oauth.dto';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
import { RequestWithLogInfo } from 'src/types';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { RequestResetTokenDto } from '../dtos/web/request-reset-token.dto';
import { ResponseResetTokenDto } from '../dtos/web/response-reset-token.dto';
import { RequestCheckResetTokenDto } from '../dtos/web/request-check-reset-token.dto';
import { ResponseCheckResetTokenDto } from '../dtos/web/response-check-reset-token.dto';
import { identifyUser } from 'src/modules/user-management/utils/identify-user';
import { UserEntity } from 'src/modules/user-management/entities/user.entity';

@ApiTags('auth')
@Controller({ version: '1', path: '/auth' })
@UseInterceptors(LogInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Sign in a user',
    description: 'Authenticate user with email or username and password.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful sign in.',
    type: ResponseSigninDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @LogEvent(EventType.SIGNIN)
  async signIn(
    @Body() signInDto: RequestSignInDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseSigninDto> {
    const result = await this.authService.signin(
      signInDto.usernameOrEmail,
      signInDto.password,
    );
    req.logInfo = {
      userId: result.user.id,
      fullname: identifyUser(result?.user as UserEntity),
    };
    return result;
  }

  @Public()
  @Post('oauth')
  @ApiOperation({
    summary: 'Handle OAuth sign-in/signup',
    description:
      'Accepts an ID token or access token from a supported OAuth provider and signs in or registers the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful OAuth sign in or registration.',
    type: ResponseSigninDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Missing or invalid OAuth data.',
  })
  async oauth(@Body() oauthDto: OAuthRequestDto): Promise<ResponseSigninDto> {
    const { provider, idToken } = oauthDto;
    if (!provider || !idToken) {
      throw new BadRequestException('Missing provider or idToken');
    }
    return this.authService.handleOAuth(provider, idToken);
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Obtain a new access token using a valid refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token successfully refreshed.',
    type: ResponseSigninDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token.',
  })
  async refreshToken(
    @Body() body: RefreshTokenDto,
  ): Promise<ResponseSigninDto> {
    return this.authService.refreshToken(body.refresh_token);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Send an email with a link to reset the user password.',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email address.',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
  })
  async requestPasswordReset(
    @Body() body: RequestResetTokenDto,
  ): Promise<ResponseResetTokenDto> {
    return this.authService.requestResetToken(body);
  }

  @Public()
  @Post('check-reset-token')
  @ApiOperation({
    summary: 'Check reset token validity',
    description: 'Check if the reset token is valid.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid.',
  })
  @ApiResponse({
    status: 401,
    description: 'Token is invalid.',
  })
  async checkResetToken(
    @Body() body: RequestCheckResetTokenDto,
  ): Promise<ResponseCheckResetTokenDto> {
    return this.authService.checkRestTokenValidity(body);
  }
}
