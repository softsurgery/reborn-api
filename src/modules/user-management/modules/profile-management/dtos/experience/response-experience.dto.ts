import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ProfileEntity } from 'src/modules/user-management/entities/profile.entity';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { OneToMany } from 'typeorm';

export class ResponseExperienceDto extends ResponseDtoHelper {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  company: string;

  @ApiProperty()
  @Expose()
  startDate: string;

  @ApiProperty()
  @Expose()
  endDate: string;

  @ApiProperty()
  @Expose()
  description: string;

  @OneToMany(() => ProfileEntity, (profile) => profile.educations)
  profiles: ProfileEntity[];
}
