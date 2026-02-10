import { Injectable } from '@nestjs/common';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { ExperienceEntity } from '../entities/experience.entity';
import { ExperienceRepository } from '../repositories/experience.repository';
import { UserService } from './user.service';
import { UserNotFoundException } from 'src/shared/abstract-user-management/errors/user/user.notfound.error';
import { ExperienceNotFoundException } from '../errors/experiences/experience.notfound.error';

@Injectable()
export class ExperienceService extends AbstractCrudService<ExperienceEntity> {
  constructor(
    private readonly experienceRepository: ExperienceRepository,
    private readonly userService: UserService,
  ) {
    super(experienceRepository);
  }

  async findByUser(id: string): Promise<ExperienceEntity[]> {
    return this.experienceRepository.findAll({
      where: {
        userId: id,
      },
    });
  }

  async addExperience(
    id: string,
    createExperienceDto: Partial<ExperienceEntity>,
  ): Promise<ExperienceEntity> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    return this.experienceRepository.save({
      ...createExperienceDto,
      userId: id,
    });
  }

  async updateExperience(
    id: number,
    updateExperienceDto: Partial<ExperienceEntity>,
  ): Promise<ExperienceEntity> {
    const experience = await this.experienceRepository.findOneById(id);
    if (!experience) {
      throw new ExperienceNotFoundException();
    }
    return this.experienceRepository.save({
      ...updateExperienceDto,
      id: experience.id,
    });
  }

  async deleteExperience(id: number): Promise<ExperienceEntity | null> {
    const experience = await this.experienceRepository.findOneById(id);
    if (!experience) {
      throw new ExperienceNotFoundException();
    }
    return this.experienceRepository.softDelete(id);
  }
}
