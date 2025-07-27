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
import { RefreshTokenDto } from '../dtos/response-refresh-token';
import { ResponseSigninDto } from '../dtos/response-signin.dto';
import { SignInDto } from '../dtos/signin.dto';
import { SignUpDto } from '../dtos/signup.dto';
import { ResponseSignupDto } from '../dtos/response-signup.dto';
import { OAuthRequestDto } from '../dtos/response-oauth.dto';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
import { RequestWithLogInfo } from 'src/types';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';

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
    @Body() signInDto: SignInDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseSigninDto> {
    const result = await this.authService.signin(
      signInDto.usernameOrEmail,
      signInDto.password,
    );
    req.logInfo = { userId: result.user.id };
    return result;
  }

  @Public()
  @Post('sign-up')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Create a new user account with username, email, and password.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    type: ResponseSignupDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  async register(@Body() registerDto: SignUpDto) {
    try {
      return this.authService.signup(registerDto);
    } catch (error) {
      throw new BadRequestException(`User registration failed: ${error}`);
    }
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
}
