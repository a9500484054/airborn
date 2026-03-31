/**
 * Messages Controller
 * Handles HTTP requests for messages
 */
import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@Controller('messages')
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get messages with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.messagesService.findAll(page, limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search messages by content' })
  @ApiQuery({ name: 'query', required: true, type: String, example: 'hello' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async search(
    @Query('query') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.messagesService.search(query, page, limit);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message (own messages only)' })
  @ApiParam({ name: 'id', type: String, description: 'Message ID' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.messagesService.remove(id, user.id);
    return { message: 'Message deleted successfully' };
  }
}
