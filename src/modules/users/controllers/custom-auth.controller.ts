import {
  Body,
  Controller,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { NotificationInterceptor } from 'src/shared/notifications/decorators/notification.interceptor';
import { identifyUser } from 'src/shared/abstract-user-management/utils/identify-user';
import { Public } from 'src/shared/auth/utils/public-strategy';
import { RequestClientSpecializedSignUpDto } from '../dtos/custom-auth/request-client-specialized-signup.dto';
import { CustomAuthService } from '../services/custom-auth.service';

@ApiTags('client-custom-auth')
@Controller({ version: '1', path: '/client-custom-auth' })
@UseInterceptors(LogInterceptor)
@UseInterceptors(NotificationInterceptor)
export class ClientCustomAuthController {
  constructor(private customAuthService: CustomAuthService) {}

  @Public()
  @Post('sign-up')
  @ApiOperation({
    summary: 'Register a new specialized client user',
    description:
      'Create a new specialized client user account with username, email, password, industries, and picture.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    type: RequestClientSpecializedSignUpDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @LogEvent(EventType.CLIENT_SIGNUP)
  async register(
    @Body() registerDto: RequestClientSpecializedSignUpDto,
    @Request() req: AdvancedRequest,
  ) {
    const response = await this.customAuthService.extendedSignup(registerDto);
    req.logInfo = {
      userId: response?.id,
      clientName: identifyUser(response),
    };
    return response;
  }
}
