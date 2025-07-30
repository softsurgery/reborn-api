import { Module } from '@nestjs/common';
import { TemplateService } from './services/template.service';
import { TemplateRepository } from './repositories/template.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateEntity } from './entities/template.entity';
import { TemplateStyleEntity } from './entities/template-style.entity';
import { TemplateStyleService } from './services/template-style.service';
import { TemplateStyleRepository } from './repositories/template-style.repository';

@Module({
  controllers: [],
  providers: [
    TemplateService,
    TemplateRepository,
    TemplateStyleService,
    TemplateStyleRepository,
  ],
  exports: [TemplateService, TemplateStyleService],
  imports: [TypeOrmModule.forFeature([TemplateEntity, TemplateStyleEntity])],
})
export class TemplateModule {}
