import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { TemplateService } from 'src/shared/templates/services/template.service';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class TemplatesSeedCommand {
  constructor(private readonly templateService: TemplateService) {}

  @Command({
    command: 'seed:templates',
    describe: 'Seed all templates from assets folder',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of templates...');
    //=============================================================================================

    // Root folder of your templates
    const templatesRoot = path.resolve(process.cwd(), 'src/assets/templates');
    console.log('Templates root:', templatesRoot);

    const folderNames = await fs.readdir(templatesRoot);

    for (const folderName of folderNames) {
      const folderPath = path.join(templatesRoot, folderName);
      const stat = await fs.stat(folderPath);

      // Only handle folders
      if (stat.isDirectory()) {
        const indexPath = path.join(folderPath, 'index.ejs');

        try {
          const content = await fs.readFile(indexPath, 'utf-8');

          await this.templateService.save({
            name: folderName,
            content: content,
          });

          console.log(`✅ Seeded template: ${folderName}`);
        } catch (err) {
          console.warn(`⚠️ Skipped ${folderName}: ${err}`);
        }
      }
    }
    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
