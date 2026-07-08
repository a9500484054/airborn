import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as webpush from 'web-push';
import { PushSubscription } from './entities/push-subscription.entity';
import { google } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';

export interface PushSubscriptionDto {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);
  private fcmAccessToken: string = '';
  private tokenExpiry: number = 0;

  constructor(
    @InjectRepository(PushSubscription)
    private pushSubscriptionRepo: Repository<PushSubscription>,
  ) {
    // Настраиваем VAPID как запасной вариант
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

    if (vapidPublicKey && vapidPrivateKey) {
      webpush.setVapidDetails(
        'mailto:airbornonline@yandex.ru',
        vapidPublicKey,
        vapidPrivateKey,
      );
      this.logger.log('VAPID keys configured');
    }

    // Если есть Firebase Service Account, используем его
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      this.logger.log('Firebase Service Account configured');
    }
  }

  /**
   * Получает OAuth2 токен для FCM HTTP v1 API
   */
  private async getFCMAccessToken(): Promise<string> {
    // Если токен еще валиден (на 1 час), возвращаем его
    if (this.fcmAccessToken && Date.now() < this.tokenExpiry) {
      return this.fcmAccessToken;
    }

    try {
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
      if (!serviceAccountPath) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH not set');
      }

      // Загружаем JSON с сервисным аккаунтом
      const serviceAccount = JSON.parse(
        fs.readFileSync(path.resolve(serviceAccountPath), 'utf8')
      );

      // Создаем клиент для аутентификации
      const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
      });

      const client = await auth.getClient();
      const token = await client.getAccessToken();
      
      this.fcmAccessToken = token.token as string;
      this.tokenExpiry = Date.now() + 3500000; // ~1 час
      
      this.logger.log('FCM Access Token получен успешно');
      return this.fcmAccessToken;
      
    } catch (error) {
      this.logger.error(`Ошибка получения FCM токена: ${error.message}`);
      throw error;
    }
  }

  /**
   * Отправляет через FCM HTTP v1 API
   */
  private async sendViaFCMv1(
    subscription: any,
    payload: string
  ): Promise<void> {
    try {
      const accessToken = await this.getFCMAccessToken();
      
      // Извлекаем project_id из service account
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
      const serviceAccount = JSON.parse(
        fs.readFileSync(path.resolve(serviceAccountPath), 'utf8')
      );
      const projectId = serviceAccount.project_id;

      // Формируем правильную структуру для FCM v1
      const fcmPayload = {
        message: {
          token: subscription.endpoint.split('/').pop(), // Извлекаем token из endpoint
          notification: {
            title: JSON.parse(payload).title || 'AirBorn',
            body: JSON.parse(payload).body || 'Новое сообщение',
          },
          webpush: {
            fcm_options: {
              link: JSON.parse(payload).data?.url || '/chat',
            },
          },
          data: JSON.parse(payload).data || {},
        },
      };

      // Отправляем запрос к FCM v1 API
      const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fcmPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`FCM Error: ${response.status} - ${errorText}`);
      }

      this.logger.log('✅ Уведомление отправлено через FCM v1 API');
      
    } catch (error) {
      this.logger.error(`❌ Ошибка отправки через FCM v1: ${error.message}`);
      throw error;
    }
  }

  /**
   * Отправляет push-уведомление через web-push (с VAPID) как запасной вариант
   */
  private async sendViaWebPush(
    pushSubscription: webpush.PushSubscription,
    payload: string
  ): Promise<void> {
    try {
      await webpush.sendNotification(pushSubscription, payload);
      this.logger.log('✅ Уведомление отправлено через web-push (VAPID)');
    } catch (error) {
      this.logger.error(`❌ Ошибка web-push: ${error.message}`);
      throw error;
    }
  }

  /**
   * Отправляет уведомление с автоматическим выбором метода
   */
  async sendToOthers(excludeUserId: string, payload: string): Promise<void> {
    try {
      const subscriptions = await this.pushSubscriptionRepo
        .createQueryBuilder('sub')
        .where('sub.user_id != :excludeUserId', { excludeUserId })
        .andWhere('sub.is_active = true')
        .getMany();

      if (subscriptions.length === 0) {
        this.logger.debug('[Push] No active subscriptions');
        return;
      }

      this.logger.log(`[Push] Sending to ${subscriptions.length} users`);

      for (const sub of subscriptions) {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          };

          // Пробуем отправить через FCM v1 (с Google Auth)
          if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
            await this.sendViaFCMv1(pushSubscription, payload);
          } else {
            // Или через web-push (VAPID)
            await this.sendViaWebPush(pushSubscription as webpush.PushSubscription, payload);
          }
          
        } catch (error: any) {
          this.logger.error(`[Push] Failed for ${sub.userId}: ${error.message}`);
          // Если подписка невалидна - удаляем
          if ([404, 410, 401].includes(error.statusCode)) {
            await this.pushSubscriptionRepo.delete(sub.id);
          }
        }
      }
    } catch (error) {
      this.logger.error(`[Push] sendToOthers error: ${error.message}`);
    }
  }

  async sendToUser(userId: string, payload: string): Promise<void> {
    try {
      const subscriptions = await this.pushSubscriptionRepo.find({
        where: { userId, isActive: true },
      });

      if (subscriptions.length === 0) {
        this.logger.warn(`[Push] No subscriptions for user ${userId}`);
        return;
      }

      this.logger.log(`[Push] Sending to user ${userId}`);

      for (const sub of subscriptions) {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          };

          if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
            await this.sendViaFCMv1(pushSubscription, payload);
          } else {
            await this.sendViaWebPush(pushSubscription as webpush.PushSubscription, payload);
          }
          
        } catch (error: any) {
          this.logger.error(`[Push] Failed: ${error.message}`);
          if ([404, 410, 401].includes(error.statusCode)) {
            await this.pushSubscriptionRepo.delete(sub.id);
          }
        }
      }
    } catch (error) {
      this.logger.error(`[Push] sendToUser error: ${error.message}`);
    }
  }

  async saveSubscription(
    userId: string,
    subscription: PushSubscriptionDto,
  ): Promise<void> {
    try {
      const existing = await this.pushSubscriptionRepo.findOne({
        where: { userId, endpoint: subscription.endpoint },
      });

      if (existing) {
        existing.isActive = true;
        existing.p256dh = subscription.keys.p256dh;
        existing.auth = subscription.keys.auth;
        await this.pushSubscriptionRepo.save(existing);
        this.logger.log(`✅ Subscription updated for user ${userId}`);
      } else {
        const newSub = this.pushSubscriptionRepo.create({
          userId,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        });
        await this.pushSubscriptionRepo.save(newSub);
        this.logger.log(`✅ New subscription saved for user ${userId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to save subscription: ${error.message}`);
      throw error;
    }
  }

  async unsubscribe(endpoint: string): Promise<void> {
    await this.pushSubscriptionRepo.delete({ endpoint });
    this.logger.debug(`Unsubscribed device: ${endpoint}`);
  }
}