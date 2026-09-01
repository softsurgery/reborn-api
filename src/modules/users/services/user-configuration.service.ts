import { Injectable } from '@nestjs/common';
import { ConfigurationNamespaceService } from 'src/shared/configurations/services/configuration-namespace.service';
import { ConfigurationNamespaces } from 'src/app/enums/configuration-namespaces.enum';
import { ConfigurationParamService } from 'src/shared/configurations/services/configuration-param.service';
import { ParamVariant } from 'src/shared/configurations/enums/param-variant.enum';
import { ConfigurationNamespaceEntity } from 'src/shared/configurations/entities/configuration-namespace.entity';

@Injectable()
export class UserConfigurationService {
  constructor(
    private readonly configurationNamespaceService: ConfigurationNamespaceService,
    private readonly configurationParamService: ConfigurationParamService,
  ) {}

  async getMobileAppSettingsConfiguration(
    userId: string,
  ): Promise<ConfigurationNamespaceEntity | null> {
    const namespace =
      await this.configurationNamespaceService.findOneByCondition({
        filter: `userId||$eq||${userId};name||$eq||${ConfigurationNamespaces.MOBILE_APP_SETTINGS}`,
        join: 'params',
      });

    return namespace;
  }

  async createMobileAppSettingsConfiguration(
    userId: string,
  ): Promise<ConfigurationNamespaceEntity> {
    const existingConfig =
      await this.configurationNamespaceService.findOneByCondition({
        filter: `userId||$eq||${userId};name||$eq||${ConfigurationNamespaces.MOBILE_APP_SETTINGS}`,
      });
    if (existingConfig) throw new Error('Configuration already exists');

    const namespace = await this.configurationNamespaceService.save({
      name: ConfigurationNamespaces.MOBILE_APP_SETTINGS,
      description: 'Mobile app settings',
      userId,
    });

    await this.configurationParamService.save({
      name: 'quick-actions',
      description: 'Quick actions order and selection',
      variant: ParamVariant.STRING,
      value: JSON.stringify([
        'work',
        'myJobs',
        'requests',
        'savedJobs',
        'reviews',
        'viewed',
      ]),
      namespaceId: namespace.id,
    });

    return namespace;
  }

  async updateMobileAppSettingsConfiguration(
    userId: string,
    activeIds: string[],
  ): Promise<ConfigurationNamespaceEntity | null> {
    let namespace = await this.getMobileAppSettingsConfiguration(userId);

    if (!namespace) {
      namespace = await this.createMobileAppSettingsConfiguration(userId);
    }

    let paramId = namespace.params?.find((p) => p.name === 'quick-actions')?.id;

    if (!paramId) {
      const param = await this.configurationParamService.save({
        name: 'quick-actions',
        description: 'Quick actions order and selection',
        variant: ParamVariant.STRING,
        value: JSON.stringify(activeIds),
        namespaceId: namespace.id,
      });
      paramId = param.id;
    } else {
      await this.configurationParamService.updateBatchParams([
        {
          id: paramId,
          value: JSON.stringify(activeIds),
        },
      ]);
    }

    return this.getMobileAppSettingsConfiguration(userId);
  }
}
