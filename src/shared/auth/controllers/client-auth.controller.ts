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
import { ResponseSigninDto } from '../dtos/web/response-signin.dto';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/shared/logger/enums/event-type.enum';
import { RequestWithLogInfo } from 'src/types';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { ClientAuthService } from '../services/client-auth.service';
import { RequestClientSignUpDto } from '../dtos/client/request-client-signup.dto';
import { ResponseClientSignupDto } from '../dtos/client/response-client-signup.dto';
import { RequestClientSignInDto } from '../dtos/client/request-client-signin.dto';

@ApiTags('client-auth')
@Controller({ version: '1', path: '/client-auth' })
@UseInterceptors(LogInterceptor)
export class ClientAuthController {
  constructor(private clientAuthService: ClientAuthService) {}

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
  async signIn(
    @Body() signInDto: RequestClientSignInDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseSigninDto> {
    const result = await this.clientAuthService.signin(
      signInDto.email,
      signInDto.password,
    );
    req.logInfo = { userId: result.user.id };
    return result;
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
  async register(@Body() registerDto: RequestClientSignUpDto) {
    try {
      return this.clientAuthService.signup(registerDto);
    } catch (error) {
      throw new BadRequestException(`User registration failed: ${error}`);
    }
  }
}
