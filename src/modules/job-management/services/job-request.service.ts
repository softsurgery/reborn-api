import { Transactional } from '@nestjs-cls/transactional';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { JobRequestRepository } from '../repositories/job-request.repository';
import { JobRequestEntity } from '../entities/job-request.entity';
import { JobRequestNotFoundException } from '../errors/job-request/job-request.notfound.error';
import { CreateJobRequestDto } from '../dtos/job-request/create-job-request.dto';
import { UpdateJobRequestDto } from '../dtos/job-request/update-job-request.dto';
import { JobRepository } from '../repositories/job.repository';
import { UserNotFoundException } from 'src/modules/user-management/errors/user/user.notfound.error';
import { JobRequestStatus } from '../enums/job-request-status.enum';
import { JobRequestCannotRequestOwnJobException } from '../errors/job-request/job-request.cannotrequestownjob.error';
import { ConversationService } from 'src/modules/chat/services/conversation.service';

@Injectable()
export class JobRequestService {
  constructor(
    private readonly jobRequestRepository: JobRequestRepository,
    private readonly jobRepository: JobRepository,
    private readonly conversationService: ConversationService,
  ) {}

  async findOneById(id: number): Promise<JobRequestEntity> {
    const jobRequest = await this.jobRequestRepository.findOneById(id);
    if (!jobRequest) {
      throw new JobRequestNotFoundException();
    }
    return jobRequest;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<JobRequestEntity | null> {
    const queryBuilder = new QueryBuilder(
      this.jobRequestRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const jobRequest = await this.jobRequestRepository.findOne(
      queryOptions as FindOneOptions<JobRequestEntity>,
    );
    return jobRequest;
  }

  async findAll(query: IQueryObject): Promise<JobRequestEntity[]> {
    const queryBuilder = new QueryBuilder(
      this.jobRequestRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const jobRequests = await this.jobRequestRepository.findAll(
      queryOptions as FindManyOptions<JobRequestEntity>,
    );
    return jobRequests;
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<JobRequestEntity>> {
    const queryBuilder = new QueryBuilder(
      this.jobRequestRepository.getMetadata(),
    );
    const queryOptions = queryBuilder.build(query);
    const count = await this.jobRequestRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.jobRequestRepository.findAll(
      queryOptions as FindManyOptions<JobRequestEntity>,
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
  async save(
    createJobRequestDto: CreateJobRequestDto,
    userId?: string,
  ): Promise<JobRequestEntity> {
    if (!userId) {
      throw new BadRequestException('User id is required');
    }
    const job = await this.jobRepository.findOneById(createJobRequestDto.jobId);
    if (job?.postedById == userId) {
      throw new JobRequestCannotRequestOwnJobException();
    }
    return await this.jobRequestRepository.save({
      ...createJobRequestDto,
      userId,
    });
  }

  @Transactional()
  async update(
    id: number,
    updateJobRequestDto: UpdateJobRequestDto,
  ): Promise<JobRequestEntity | null> {
    return this.jobRequestRepository.update(id, updateJobRequestDto);
  }

  async softDelete(id: number): Promise<JobRequestEntity | null> {
    return this.jobRequestRepository.softDelete(id);
  }

  async delete(id: number): Promise<JobRequestEntity | null> {
    const jobRequest = await this.jobRequestRepository.findOneById(id);
    if (!jobRequest) {
      throw new JobRequestNotFoundException();
    }
    return this.jobRequestRepository.remove(jobRequest);
  }

  //Extended Methods ===========================================================================

  async isJobRequestAlreadyExists(
    jobId: string,
    userId?: string,
  ): Promise<JobRequestEntity | null> {
    if (!userId) {
      throw new UserNotFoundException();
    }
    const jobRequest = await this.jobRequestRepository.findOne({
      where: { userId, jobId },
    });
    return jobRequest;
  }

  @Transactional()
  async approveJobRequest(id: number): Promise<JobRequestEntity | null> {
    const jobRequest = await this.jobRequestRepository.findOne({
      where: { id },
      relations: ['job'],
    });
    if (!jobRequest) {
      throw new JobRequestNotFoundException();
    }
    const conversation = await this.conversationService.findConversationByUsers(
      jobRequest.userId,
      jobRequest.job.postedById,
    );
    if (!conversation) {
      await this.conversationService.save(
        {
          targetUserId: jobRequest.userId,
        },
        jobRequest?.job?.postedById,
      );
    }
    return this.jobRequestRepository.update(jobRequest.id, {
      status: JobRequestStatus.Approved,
    });
  }

  async rejectJobRequest(id: number): Promise<JobRequestEntity | null> {
    const jobRequest = await this.jobRequestRepository.findOneById(id);
    if (!jobRequest) {
      throw new JobRequestNotFoundException();
    }
    return this.jobRequestRepository.update(jobRequest.id, {
      status: JobRequestStatus.Rejected,
    });
  }

  async cancelJobRequest(id: number): Promise<JobRequestEntity | null> {
    const jobRequest = await this.jobRequestRepository.findOneById(id);
    if (!jobRequest) {
      throw new JobRequestNotFoundException();
    }
    return this.jobRequestRepository.softDelete(jobRequest.id);
  }

  async findPaginatedUserOngoingJobRequests(
    query: IQueryObject,
    userId?: string,
  ): Promise<PageDto<JobRequestEntity>> {
    if (!userId) {
      throw new UserNotFoundException();
    }
    const queryBuilder = new QueryBuilder(
      this.jobRequestRepository.getMetadata(),
    );

    const queryOptions = queryBuilder.build(query);

    queryOptions.where = {
      ...queryOptions.where,
      userId,
    };

    const count = await this.jobRequestRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.jobRequestRepository.findAll(
      queryOptions as FindManyOptions<JobRequestEntity>,
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

  async findPaginatedUserIncomingJobRequests(
    query: IQueryObject,
    userId?: string,
  ): Promise<PageDto<JobRequestEntity>> {
    if (!userId) {
      throw new UserNotFoundException();
    }
    const userPostedJobs = await this.jobRepository.findAll({
      where: { postedById: userId },
    });

    if (userPostedJobs.length === 0) {
      return new PageDto(
        [],
        new PageMetaDto({
          pageOptionsDto: {
            page: Number(query.page),
            take: Number(query.limit),
          },
          itemCount: 0,
        }),
      );
    }

    const queryBuilder = new QueryBuilder(
      this.jobRequestRepository.getMetadata(),
    );

    const queryOptions = queryBuilder.build(query);

    queryOptions.where = {
      ...queryOptions.where,
      jobId: In(userPostedJobs.map((j) => j.id)),
    };

    const count = await this.jobRequestRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.jobRequestRepository.findAll(
      queryOptions as FindManyOptions<JobRequestEntity>,
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

  async findRequestCount(id: string): Promise<number> {
    return this.jobRequestRepository.getTotalCount({
      where: { jobId: id },
    });
  }
}
