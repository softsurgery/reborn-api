import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { UserRepository } from '../repositories/user.repository';
import { UserNotFoundException } from '../errors/user/user.notfound.error';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { hashPassword } from 'src/shared/helpers/hash.utils';
import { UserAlreadyExistsException } from '../errors/user/user.alreadyexists.error';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { ProfileService } from 'src/modules/user-management/services/profile.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileService: ProfileService,
  ) {}

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async findOneByCondition(query: IQueryObject): Promise<UserEntity | null> {
    const queryBuilder = new QueryBuilder(this.userRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const user = await this.userRepository.findOne(
      queryOptions as FindOneOptions<UserEntity>,
    );
    return user;
  }

  async findAll(query: IQueryObject): Promise<UserEntity[]> {
    const queryBuilder = new QueryBuilder(this.userRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const users = await this.userRepository.findAll(
      queryOptions as FindManyOptions<UserEntity>,
    );
    return users;
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<UserEntity>> {
    const queryBuilder = new QueryBuilder(this.userRepository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.userRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.userRepository.findAll(
      queryOptions as FindManyOptions<UserEntity>,
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
  async save(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    let profileId: number | undefined = undefined;

    if (createUserDto.profile) {
      const profile = await this.profileService.save(createUserDto.profile);
      profileId = profile.id;
    }

    const hashedPassword =
      createUserDto.password && (await hashPassword(createUserDto.password));
    createUserDto.password = hashedPassword;

    return this.userRepository.save({
      ...createUserDto,
      profileId,
    });
  }

  @Transactional()
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity | null> {
    const existingUser = await this.userRepository.findOneById(id);
    if (updateUserDto.profile && existingUser?.profileId) {
      await this.profileService.update(
        existingUser?.profileId,
        updateUserDto.profile,
      );
    }
    if (updateUserDto.password) {
      const hashedPassword = await hashPassword(updateUserDto.password);
      updateUserDto.password = hashedPassword;
    }
    return this.userRepository.update(id, updateUserDto);
  }

  async softDelete(id: string): Promise<UserEntity | null> {
    return await this.userRepository.softDelete(id);
  }

  //Extended Methods ===========================================================================

  async findOneByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async activate(id: string): Promise<UserEntity | null> {
    const user = await this.findOneById(id);
    return this.userRepository.update(id, { ...user, isActive: true });
  }

  async deactivate(id: string): Promise<UserEntity | null> {
    const user = await this.findOneById(id);
    return this.userRepository.update(id, { ...user, isActive: false });
  }

  async approve(id: string): Promise<UserEntity | null> {
    const user = await this.findOneById(id);
    return this.userRepository.update(id, { ...user, isApproved: true });
  }

  async disapprove(id: string): Promise<UserEntity | null> {
    const user = await this.findOneById(id);
    return this.userRepository.update(id, { ...user, isApproved: false });
  }

  async changePassword(
    id: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.findOneById(id);
    const hashedPassword = await hashPassword(password);
    return this.userRepository.update(id, {
      ...user,
      password: hashedPassword,
    });
  }
}
