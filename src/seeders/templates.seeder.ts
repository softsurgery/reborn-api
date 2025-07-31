import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TemplateService } from 'src/shared/templates/services/template.service';
import { TemplateStyleService } from 'src/shared/templates/services/template-style.service';
import { TemplateStyleEntity } from 'src/shared/templates/entities/template-style.entity';

@Injectable()
export class TemplatesSeedCommand {
  constructor(
    private readonly templateService: TemplateService,
    private readonly templateStyleService: TemplateStyleService,
  ) {}

  @Command({
    command: 'seed:templates',
    describe: 'Seed all templates and styles from assets folder',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of templates and styles...');

    const templatesRoot = path.resolve(process.cwd(), 'src/assets/templates');
    const stylesRoot = path.resolve(process.cwd(), 'src/assets/styles');

    const folderNames = await fs.readdir(templatesRoot);
    const styleFiles = await fs.readdir(stylesRoot);

    // Load and upsert all styles first
    const stylesMap: Map<string, TemplateStyleEntity> = new Map();

    for (const fileName of styleFiles) {
      if (!fileName.endsWith('.css')) continue;

      const name = path.basename(fileName, '.css');
      const content = await fs.readFile(
        path.join(stylesRoot, fileName),
        'utf-8',
      );

      // Upsert style using the service
      const style = await this.templateStyleService.save({
        name,
        content,
      });

      stylesMap.set(name, style);
      console.log(`🎨 Loaded style: ${name}`);
    }

    for (const folderName of folderNames) {
      const folderPath = path.join(templatesRoot, folderName);
      const stat = await fs.stat(folderPath);
      if (!stat.isDirectory()) continue;

      const indexPath = path.join(folderPath, 'index.ejs');

      try {
        const content = await fs.readFile(indexPath, 'utf-8');

        const template = await this.templateService.save({
          name: folderName,
          content,
          styles: Array.from(stylesMap.values()),
        });

        await this.templateService.save(template);
        console.log(`✅ Seeded template: ${folderName}`);
      } catch (err) {
        console.warn(`⚠️ Skipped ${folderName}: ${err}`);
      }
    }

    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
