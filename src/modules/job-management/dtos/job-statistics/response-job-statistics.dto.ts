import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { DailyActivityDto } from './daily-activity.dto';
import { FunnelStageDto } from './funnel-stage.dto';
import { ExperienceDistributionDto } from './experience-distribution.dto';
import { TrafficSourceDto } from './traffic-source.dto';

export class ResponseJobStatisticsDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  totalViews: number;

  @ApiProperty()
  @Expose()
  totalSaves: number;

  @ApiProperty()
  @Expose()
  totalApplications: number;

  @ApiProperty()
  @Expose()
  shortlistedCandidates: number;

  @ApiProperty()
  @Expose()
  viewsTrend: number;

  @ApiProperty()
  @Expose()
  savesTrend: number;

  @ApiProperty()
  @Expose()
  applicationsTrend: number;

  @ApiProperty()
  @Expose()
  shortlistedTrend: number;

  @ApiProperty()
  @Expose()
  aiInsight: string;

  @ApiProperty({ type: [DailyActivityDto] })
  @Expose()
  @Type(() => DailyActivityDto)
  dailyActivity: DailyActivityDto[];

  @ApiProperty({ type: [FunnelStageDto] })
  @Expose()
  @Type(() => FunnelStageDto)
  funnelStages: FunnelStageDto[];

  @ApiProperty({ type: [ExperienceDistributionDto] })
  @Expose()
  @Type(() => ExperienceDistributionDto)
  experienceDistribution: ExperienceDistributionDto[];

  @ApiProperty({ type: [TrafficSourceDto] })
  @Expose()
  @Type(() => TrafficSourceDto)
  trafficSources: TrafficSourceDto[];
}
