import { Controller, Post, Body, UseGuards, Req, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PushNotificationService, PushSubscriptionDto } from './push-notification.service';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

@Controller('push')
@UseGuards(JwtAuthGuard)
export class PushNotificationController {
  private readonly logger = new Logger(PushNotificationController.name);

  constructor(
    private readonly pushService: PushNotificationService,
  ) {}

  @Post('subscribe')
  async subscribe(
    @Body() subscription: PushSubscriptionDto,
    @Req() req: { user: AuthenticatedUser },
  ) {
    try {
      await this.pushService.saveSubscription(req.user.id, subscription);
      return { success: true, message: 'Subscribed successfully' };
    } catch (error) {
      this.logger.error(`Subscription failed: ${error.message}`);
      return { success: false, message: 'Failed to subscribe' };
    }
  }

  @Post('test')
  async testNotification(
    @Req() req: { user: AuthenticatedUser },
  ) {
    try {
      const payload = JSON.stringify({
        title: 'AirBorn - Тестовое уведомление',
        body: 'Push-уведомления работают! ✅',
        icon: '/logo.svg',
        badge: '/logo.svg',
        data: { url: '/chat' },
      });

      await this.pushService.sendToUser(req.user.id, payload);
      return { success: true, message: 'Test notification sent' };
    } catch (error) {
      this.logger.error(`Test notification failed: ${error.message}`);
      return { success: false, message: 'Failed to send test notification' };
    }
  }
}
