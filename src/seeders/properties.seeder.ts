import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import { StoreService } from 'src/shared/store/services/store.service';

@Injectable()
export class PropertiesSeedCommand {
  constructor(private readonly storeService: StoreService) {}

  @Command({
    command: 'seed:properties',
    describe: 'Seed properties',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of properties...');
    //=============================================================================================
    await this.storeService.saveMany([
      {
        id: 'core',
        description: 'Core company information',
        value: {
          name: 'SUPER COMPANY',
          support: 'support@super.company',
          address: '123 Main Street, Anytown',
        },
      },
      {
        id: 'faqs',
        description: 'Frequently Asked Questions',
        value: [
          {
            question: 'What is the return policy?',
            answer: 'You can return any item within 30 days for a full refund.',
          },
          {
            question: 'How long does shipping take?',
            answer: 'Shipping usually takes 5-7 business days.',
          },
          {
            question: 'What is the return policy?',
            answer: 'You can return any item within 30 days for a full refund.',
          },
          {
            question: 'How long does shipping take?',
            answer: 'Shipping usually takes 5-7 business days.',
          },
          {
            question: 'What is the warranty period?',
            answer: 'All products come with a 1-year warranty.',
          },
        ],
      },
    ]);
    //=============================================================================================
    const end = new Date();
    console.log(
      `✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`,
    );
  }
}
