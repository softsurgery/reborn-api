import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { ConfigurationParamRepository } from 'src/shared/configurations/repositories/configuration-param.repository';
import { ConfigurationNamespaceRepository } from 'src/shared/configurations/repositories/configuration-namespace.repository';
import { ConfigurationNamespaces } from 'src/app/enums/configuration-namespaces.enum';
import {
  coreConfiguration,
  financialConfiguration,
} from './data/configuration.data';

@Injectable()
export class ConfigurationSeedCommand {
  constructor(
    private readonly configurationNamespaceRepository: ConfigurationNamespaceRepository,
    private readonly configurationParamRepository: ConfigurationParamRepository,
  ) {}

  @Command({
    command: 'seed:configuration',
    describe: 'seed system configuration',
  })
  async seed(): Promise<void> {
    const start = new Date();

    console.log('🚀 Starting seeding of configuration...');

    const configurationByNamespace = {
      [ConfigurationNamespaces.CORE]: coreConfiguration,
      [ConfigurationNamespaces.FINANCIAL]: financialConfiguration,
    } as const;

    for (const namespace of Object.keys(
      configurationByNamespace,
    ) as ConfigurationNamespaces[]) {
      const params = configurationByNamespace[namespace];

      const existing = await this.configurationNamespaceRepository.findOne({
        where: { name: namespace },
      });

      if (existing) {
        continue;
      }

      const namespaceEntity = await this.configurationNamespaceRepository.save({
        name: namespace,
        description: `${namespace} configuration`,
      });

      await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        params.map((param) =>
          this.configurationParamRepository.save({
            ...param,
            namespaceId: namespaceEntity.id,
          }),
        ),
      );
    }

    const end = new Date();

    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
