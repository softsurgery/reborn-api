import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Put,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { RequestWithLogInfo } from 'src/types';
import { toDto } from 'src/shared/database/utils/dtos';
import { UpdateClientDto } from '../dtos/client/update-client.dto';
import { ResponseClientDto } from '../dtos/client/response-client.dto';

@ApiTags('client')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({
  version: '1',
  path: '/client',
})
export class ClientController {
  constructor(private readonly userService: UserService) {}

  @Get('/current')
  async findCurrentUser(
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseClientDto | null> {
    if (!req?.user?.sub) {
      return null;
    }
    const user = await this.userService.findOneById(req?.user?.sub);
    return toDto(ResponseClientDto, user);
  }

  @Put()
  async updateCurrentUser(
    @Body() updateClientDto: UpdateClientDto,
    @Request() req: RequestWithLogInfo,
  ): Promise<ResponseClientDto | null> {
    if (!req?.user?.sub) {
      return null;
    }
    return toDto(
      ResponseClientDto,
      await this.userService.update(req?.user?.sub, updateClientDto),
    );
  }
}
