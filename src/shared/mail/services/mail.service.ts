import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { TemplateService } from 'src/shared/templates/services/template.service';
import * as juice from 'juice';
import * as ejs from 'ejs';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly templateService: TemplateService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async renderTemplateFromDb(
    templateName: string,
    variables: Record<string, unknown>,
  ): Promise<string> {
    const template = await this.templateService.findOneByName(templateName);

    if (!template?.content) {
      throw new Error(
        `Template "${templateName}" not found or has no EJS content.`,
      );
    }

    const renderedHtml = ejs.render(template.content, variables);

    const styleContent =
      template.styles?.map((style) => style.content).join('\n') ?? '';
    const fullHtml = `<style>${styleContent}</style>\n${renderedHtml}`;

    const inlinedHtml = juice(fullHtml);
    return inlinedHtml;
  }

  /**
   * Sends an email using a rendered template from the database.
   */
  async sendTemplate<T>(
    to: string,
    subject: string,
    templateName: string,
    variables: T,
  ): Promise<void> {
    const html = await this.renderTemplateFromDb(
      templateName,
      variables as Record<string, string>,
    );
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
