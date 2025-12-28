import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import {
  Education,
  Experience,
  Skill,
} from '../interfaces/walk-of-life.interface';
import { ProfileEntity } from 'src/modules/user-management/entities/profile.entity';
import { ProfileRepository } from 'src/modules/user-management/repositories/profile.repository';
import { ProfileNotFoundException } from 'src/modules/user-management/errors/profile/profile.notfound.error';

@Injectable()
export class WalkOfLifeService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  @Transactional()
  async updateExperiences(
    id: number,
    experiences: Experience[],
  ): Promise<ProfileEntity | null> {
    const profile = await this.profileRepository.findOneById(id);
    if (!profile) throw new ProfileNotFoundException();
    return this.profileRepository.update(id, { experiences });
  }

  @Transactional()
  async updateEducations(
    id: number,
    educations: Education[],
  ): Promise<ProfileEntity | null> {
    const profile = await this.profileRepository.findOneById(id);
    if (!profile) throw new ProfileNotFoundException();
    return this.profileRepository.update(id, { educations });
  }

  async updateSkills(
    id: number,
    skills: Skill[],
  ): Promise<ProfileEntity | null> {
    const profile = await this.profileRepository.findOneById(id);
    if (!profile) throw new ProfileNotFoundException();
    return this.profileRepository.update(id, { skills });
  }
}
