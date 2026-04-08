import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as webpush from 'web-push';
import { PushSubscription } from './entities/push-subscription.entity';

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

  constructor(
    @InjectRepository(PushSubscription)
    private pushSubscriptionRepo: Repository<PushSubscription>,
  ) {
    // Настраиваем VAPID ключи
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

    if (vapidPublicKey && vapidPrivateKey) {
      webpush.setVapidDetails(
        'mailto:admin@airborn.com',
        vapidPublicKey,
        vapidPrivateKey,
      );
      this.logger.log('VAPID keys configured');
    } else {
      this.logger.warn('VAPID keys not configured. Push notifications will not work.');
    }
  }

  /**
   * Сохраняет подписку устройства
   */
  async saveSubscription(
    userId: string,
    subscription: PushSubscriptionDto,
  ): Promise<void> {
    try {
      // Проверяем существует ли подписка
      const existing = await this.pushSubscriptionRepo.findOne({
        where: { userId, endpoint: subscription.endpoint },
      });

      if (existing) {
        // Обновляем существующую
        existing.isActive = true;
        await this.pushSubscriptionRepo.save(existing);
      } else {
        // Создаём новую
        const newSub = this.pushSubscriptionRepo.create({
          userId,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        });
        await this.pushSubscriptionRepo.save(newSub);
      }

      this.logger.debug(`Saved push subscription for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to save subscription: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Отправляет push-уведомление всем подписчикам кроме отправителя
   */
  async sendToOthers(
    excludeUserId: string,
    payload: string,
  ): Promise<void> {
    try {
      const subscriptions = await this.pushSubscriptionRepo
        .createQueryBuilder('sub')
        .where('sub.user_id != :excludeUserId', { excludeUserId })
        .andWhere('sub.is_active = :isActive', { isActive: true })
        .getMany();

      if (subscriptions.length === 0) {
        this.logger.debug('No active subscriptions to send push to');
        return;
      }

      this.logger.debug(`Sending push to ${subscriptions.length} subscriptions`);

      const pushPromises = subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          await webpush.sendNotification(
            pushSubscription as webpush.PushSubscription,
            payload,
          );
        } catch (error) {
          // Если подписка недействительна (404, 410), удаляем её
          if (error.statusCode === 404 || error.statusCode === 410) {
            this.logger.warn(`Removing invalid subscription`);
            await this.pushSubscriptionRepo.delete(sub.id);
          } else {
            this.logger.error(`Failed to send push: ${error.message}`);
          }
        }
      });

      await Promise.allSettled(pushPromises);
    } catch (error) {
      this.logger.error(`Failed to send push notifications: ${error.message}`, error.stack);
    }
  }

  /**
   * Отправляет push-уведомление конкретному пользователю
   */
  async sendToUser(
    userId: string,
    payload: string,
  ): Promise<void> {
    try {
      const subscriptions = await this.pushSubscriptionRepo.find({
        where: { userId, isActive: true },
      });

      if (subscriptions.length === 0) {
        this.logger.debug(`No active subscriptions for user ${userId}`);
        return;
      }

      const pushPromises = subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          await webpush.sendNotification(
            pushSubscription as webpush.PushSubscription,
            payload,
          );
        } catch (error) {
          if (error.statusCode === 404 || error.statusCode === 410) {
            await this.pushSubscriptionRepo.delete(sub.id);
          }
        }
      });

      await Promise.allSettled(pushPromises);
    } catch (error) {
      this.logger.error(`Failed to send push to user ${userId}: ${error.message}`, error.stack);
    }
  }

  /**
   * Отписывает устройство
   */
  async unsubscribe(endpoint: string): Promise<void> {
    await this.pushSubscriptionRepo.delete({ endpoint });
    this.logger.debug(`Unsubscribed device: ${endpoint}`);
  }
}
