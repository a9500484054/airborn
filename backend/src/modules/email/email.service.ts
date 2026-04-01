/**
 * Email Service
 * Handles sending emails via SMTP
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);
  private emailFrom: string;

  constructor(private configService: ConfigService) {
    this.emailFrom = this.configService.get<string>('EMAIL_FROM') || 'ayedaru@yandex.ru';
    
    // Configure transporter for Yandex SMTP
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT') || 465,
      secure: true, // true for port 465
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
      tls: {
        rejectUnauthorized: false, // Accept self-signed certificates
      },
    });

    // Verify connection
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('SMTP connection failed:', error.message);
      } else {
        this.logger.log('SMTP connection established successfully');
      }
    });
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(email: string, name: string, verificationToken: string) {
    const verificationUrl = `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001'}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: this.emailFrom,
      to: email,
      subject: 'Подтвердите ваш email - AirBorn',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Подтверждение email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🚀 AirBorn</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #333333; margin-top: 0;">Подтвердите ваш email</h2>
                      <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                        Здравствуйте, <strong>${name}</strong>!
                      </p>
                      <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                        Спасибо за регистрацию в AirBorn! Для завершения регистрации, пожалуйста, подтвердите ваш email адрес.
                      </p>
                      <p style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" 
                           style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
                          Подтвердить email
                        </a>
                      </p>
                      <p style="color: #666666; font-size: 14px; line-height: 1.6;">
                        Или скопируйте и вставьте эту ссылку в ваш браузер:
                      </p>
                      <p style="color: #667eea; font-size: 14px; word-break: break-all;">
                        ${verificationUrl}
                      </p>
                      <p style="color: #999999; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                        Ссылка действительна в течение 24 часов.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="color: #999999; font-size: 14px; margin: 0;">
                        © ${new Date().getFullYear()} AirBorn. Все права защищены.
                      </p>
                      <p style="color: #999999; font-size: 12px; margin-top: 10px;">
                        Если вы не регистрировались в AirBorn, просто проигнорируйте это письмо.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        Здравствуйте, ${name}!
        
        Спасибо за регистрацию в AirBorn!
        
        Для завершения регистрации перейдите по ссылке:
        ${verificationUrl}
        
        Ссылка действительна в течение 24 часов.
        
        Если вы не регистрировались в AirBorn, просто проигнорируйте это письмо.
        
        © ${new Date().getFullYear()} AirBorn
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Verification email sent to ${email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}:`, error.message);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }

  /**
   * Send welcome email after verification
   */
  async sendWelcomeEmail(email: string, name: string) {
    const mailOptions = {
      from: this.emailFrom,
      to: email,
      subject: 'Добро пожаловать в AirBorn! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Добро пожаловать</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff;">
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 Добро пожаловать!</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #333333;">Здравствуйте, ${name}!</h2>
                      <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                        Ваш email успешно подтвержден! Теперь вы можете пользоваться всеми возможностями AirBorn.
                      </p>
                      <p style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3001/chat" 
                           style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 25px; font-weight: bold;">
                          Перейти в чат
                        </a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Welcome email sent to ${email}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error.message);
    }
  }
}
