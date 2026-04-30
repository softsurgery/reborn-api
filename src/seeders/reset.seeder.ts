import { Command } from 'nestjs-command';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ResetProjectSeedCommand {
  private readonly logger = new Logger(ResetProjectSeedCommand.name);

  constructor(private readonly dataSource: DataSource) {}

  @Command({
    command: 'seed:reset',
    describe: 'Reset the project database and seed it again',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Resetting project database...');
    //=============================================================================================

    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();

    //=============================================================================================
    const end = new Date();
    this.logger.log(
      `Reset completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
