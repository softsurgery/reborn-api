import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { TemplateService } from 'src/shared/templates/services/template.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly templateService: TemplateService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Renders a template from the database by replacing {{key}} with actual values.
   */
  async renderTemplateFromDb(
    templateName: string,
    variables: Record<string, string>,
  ): Promise<string> {
    const template = await this.templateService.findOneByName(templateName);
    if (!template?.content) {
      throw new Error(
        `Template "${templateName}" not found or has no markdown content.`,
      );
    }

    let content = template.content;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      content = content.replace(regex, value);
    }

    return content;
  }

  /**
   * Sends an email using a rendered template from the database.
   */
  async sendTemplate(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, string>,
  ): Promise<void> {
    const html = await this.renderTemplateFromDb(templateName, variables);
    await this.sendMail(to, subject, html);
  }

  /**
   * Sends an email with HTML content.
   */
  async sendMail(
    to: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
        text,
      });
      this.logger.log(`Email successfully sent to ${to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}:`,
        error instanceof Error ? error.stack : `${error}`,
      );
    }
  }
}
