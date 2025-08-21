import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { FeedbackRepository } from '../repositories/feedback.repository';
import { DeviceInfoService } from './device-info.service';
import { FeedbackNotFoundException } from '../errors/feedback/feedback.notfound.error';
import { FeedbackEntity } from '../entities/feedback.entity';
import { CreateFeedbackDto } from '../dtos/feedback/create-feedback.dto';
import { DeviceInfoEntity } from '../entities/device-info.entity';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly deviceInfoService: DeviceInfoService,
  ) {}

  async findOneById(id: string): Promise<FeedbackEntity> {
    const feedback = await this.feedbackRepository.findOneById(id);
    if (!feedback) {
      throw new FeedbackNotFoundException();
    }
    return feedback;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<FeedbackEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.feedbackRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const feedback = await this.feedbackRepository.findOne(
      queryOptions as FindOneOptions<FeedbackEntity>,
    );
    return feedback;
  }

  async findAll(query: IQueryObject): Promise<FeedbackEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.feedbackRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const feedbacks = await this.feedbackRepository.findAll(
      queryOptions as FindManyOptions<FeedbackEntity>,
    );
    return feedbacks;
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<FeedbackEntity>> {
    const queryBuilder = new QueryBuilder(
      this.feedbackRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.feedbackRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.feedbackRepository.findAll(
      queryOptions as FindManyOptions<FeedbackEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: Number(query.page),
        take: Number(query.limit),
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  @Transactional()
  async save(createFeedbackDto: CreateFeedbackDto): Promise<FeedbackEntity> {
    return await this.feedbackRepository.save(createFeedbackDto);
  }

  @Transactional()
  async saveMany(
    createFeedbackDtos: CreateFeedbackDto[],
  ): Promise<FeedbackEntity[]> {
    return Promise.all(createFeedbackDtos.map((dto) => this.save(dto)));
  }

  async softDelete(id: string): Promise<FeedbackEntity | null> {
    return this.feedbackRepository.softDelete(id);
  }

  async delete(id: string): Promise<FeedbackEntity | null> {
    const feedback = await this.feedbackRepository.findOneById(id);
    if (!feedback) {
      throw new FeedbackNotFoundException();
    }
    return this.feedbackRepository.remove(feedback);
  }

  //Extended Methods ===========================================================================

  @Transactional()
  async saveWithDeviceInfo(
    createFeedbackDto: CreateFeedbackDto,
    userId?: string,
  ): Promise<FeedbackEntity> {
    const { device, ...rest } = createFeedbackDto;
    let existingDevice: DeviceInfoEntity | undefined = undefined;
    if (device) {
      existingDevice = await this.deviceInfoService.upsert(device);
    }
    return this.feedbackRepository.save({
      ...rest,
      deviceId: existingDevice?.id,
      userId,
    });
  }
}
