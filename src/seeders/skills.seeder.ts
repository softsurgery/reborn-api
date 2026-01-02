import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { RefTypeRepository } from 'src/shared/reference-types/repositories/ref-type.repository';
import { RefParamRepository } from 'src/shared/reference-types/repositories/ref-param.repository';
import { skills } from './data/skills.data';

@Injectable()
export class SkillsSeedCommand {
  constructor(
    private readonly refTypeRepository: RefTypeRepository,
    private readonly refParamRepository: RefParamRepository,
  ) {}

  @Command({
    command: 'seed:skills',
    describe: 'seed skills',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of skills...');
    //=============================================================================================

    let skillRefType = await this.refTypeRepository.findOne({
      where: { label: 'Skill' },
    });

    if (!skillRefType) {
      skillRefType = await this.refTypeRepository.save({
        label: 'Skill',
        description: 'Parent reference type for all skills',
      });
      for (const skill of skills) {
        await this.refParamRepository.save({
          label: skill,
          description: `This is a ${skill} reference param`,
          refType: skillRefType,
          extras: {},
        });
      }
    }

    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
