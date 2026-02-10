import { Injectable } from '@nestjs/common';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';
import { UserService } from './user.service';
import { UserNotFoundException } from 'src/shared/abstract-user-management/errors/user/user.notfound.error';
import { EducationRepository } from '../repositories/education.repository';
import { EducationEntity } from '../entities/education.entity';
import { EducationNotFoundException } from '../errors/educations/education.notfound.error';

@Injectable()
export class EducationService extends AbstractCrudService<EducationEntity> {
  constructor(
    private readonly educationRepository: EducationRepository,
    private readonly userService: UserService,
  ) {
    super(educationRepository);
  }

  async findByUser(id: string): Promise<EducationEntity[]> {
    return this.educationRepository.findAll({
      where: {
        userId: id,
      },
    });
  }

  async addEducation(
    id: string,
    createEducationDto: Partial<EducationEntity>,
  ): Promise<EducationEntity> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    return this.educationRepository.save({
      ...createEducationDto,
      userId: id,
    });
  }

  async updateEducation(
    id: number,
    updateEducationDto: Partial<EducationEntity>,
  ): Promise<EducationEntity> {
    const education = await this.educationRepository.findOneById(id);
    if (!education) {
      throw new EducationNotFoundException();
    }
    return this.educationRepository.save({
      ...updateEducationDto,
      id: education.id,
    });
  }

  async deleteEducation(id: number): Promise<EducationEntity | null> {
    const education = await this.educationRepository.findOneById(id);
    if (!education) {
      throw new EducationNotFoundException();
    }
    return this.educationRepository.softDelete(id);
  }
}
