import { Module } from '@nestjs/common';
import { TemplateService } from './services/template.service';
import { TemplateRepository } from './repositories/template.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateEntity } from './entities/template.entity';

@Module({
  controllers: [],
  providers: [TemplateService, TemplateRepository],
  exports: [TemplateService],
  imports: [TypeOrmModule.forFeature([TemplateEntity])],
})
export class TemplateModule {}
