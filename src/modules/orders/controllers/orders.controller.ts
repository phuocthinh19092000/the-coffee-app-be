import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PushNotificationDto } from 'src/modules/notification/dto/requests/push-notification-dto.dto';
import { NotificationsService } from 'src/modules/notification/services/notifications.service';
import { ProductsService } from 'src/modules/products/services/products.service';
import {
  MessageNewOrder,
  MessageUpdateOrder,
  OrderStatus,
  TitleOrder,
} from '../constants/order.constant';
import { PaginationQueryDto } from 'src/modules/shared/dto/pagination-query.dto';
import { CreateOrderDto } from '../dto/requests/create-order.dto';
import { UpdateOrderDto } from '../dto/requests/update-order.dto';
import { UpdateStatusOrderDto } from '../dto/requests/update-status-order.dto';
import { Order } from '../entities/order.entity';
import { OrdersService } from '../services/orders.service';

@Controller('orders')
@ApiBearerAuth()
@ApiTags('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly productsService: ProductsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get('/user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Get orders by userId - Sort by date',
    summary: 'Get orders by userId - Sort by date',
  })
  @ApiOkResponse({
    description: 'Get orders by UserId successfully',
    type: [Order],
  })
  async findByUserId(
    @User() user,
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<Order[]> {
    return this.orderService.findByUserId(user, paginationQueryDto);
  }

  @Get()
  @ApiOperation({
    description: 'Get orders by status',
    summary: 'Get orders by status',
  })
  @ApiOkResponse({
    description: 'Get orders by Status successfully',
    type: [Order],
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: OrderStatus,
  })
  findByStatus(@Query('status') statusName: string): Promise<Order[]> {
    return this.orderService.findByStatus(statusName);
  }

  @ApiOperation({
    description: 'Create new order',
    summary: 'Create new order',
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'Create Order successfully',
    type: CreateOrderDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Please log in',
    type: UnauthorizedException,
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @User() user,
  ): Promise<Order> {
    const product = await this.productsService.findById(createOrderDto.product);

    if (!product) {
      throw new BadRequestException({
        description: 'Wrong product ID',
        status: 400,
      });
    }

    try {
      const order = await this.orderService.create(createOrderDto, user);

      if (user.deviceToken.length > 0) {
        const notification: PushNotificationDto = {
          deviceToken: user.deviceToken,
          title: TitleOrder,
          message: MessageNewOrder,
        };

        const orderData = {
          quantity: createOrderDto.quantity.toString(),
          price: product.price.toString(),
          title: product.name,
          status: 'new',
        };

        this.notificationsService.sendNotification(notification, orderData);
      }

      return order;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Update Order successfully',
    type: UpdateOrderDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid status' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of Order',
    type: String,
  })
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusOrderDto: UpdateStatusOrderDto,
    @User() user,
  ): Promise<Order> {
    const order = await this.orderService.findById(id);
    const currentStatus = order.orderStatus.value;
    const newStatus = updateStatusOrderDto.status;

    if (
      newStatus === currentStatus + 1 ||
      (currentStatus === 0 && newStatus === -1)
    ) {
      const updatedOrder = this.orderService.updateStatus(order, newStatus);
      if (user.deviceToken.length > 0) {
        const notification: PushNotificationDto = {
          deviceToken: user.deviceToken,
          title: TitleOrder,
          message: `${MessageUpdateOrder} ${order.orderStatus.name}`,
        };

        const orderData = {
          quantity: order.quantity.toString(),
          price: order.product.price.toString(),
          title: order.product.name,
          status: order.orderStatus.name,
        };

        this.notificationsService.sendNotification(notification, orderData);
      }
      return updatedOrder;
    } else {
      throw new BadRequestException({ description: 'Invalid order status' });
    }
  }
}
