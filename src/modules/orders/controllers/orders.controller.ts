import { RolesGuard } from './../../../guards/roles.guard';
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
  OrderStatusNumber,
  TitleOrder,
} from '../constants/order.constant';
import { PaginationQueryDto } from 'src/modules/shared/dto/pagination-query.dto';
import { CreateOrderDto } from '../dto/requests/create-order.dto';
import { UpdateOrderDto } from '../dto/requests/update-order.dto';
import { UpdateStatusOrderDto } from '../dto/requests/update-status-order.dto';
import { Order } from '../entities/order.entity';
import { OrdersService } from '../services/orders.service';
import { StatusService } from 'src/modules/status/services/status.service';
import { PushNotificationGoogleChatDto } from 'src/modules/notification/dto/requests/push-notification-google-chat.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleType } from 'src/modules/roles/constants/role.constant';
import { OrderEventGateway } from 'src/modules/events/gateways/order-event.gateway';
import { HANDLE_ORDER_EVENT } from 'src/modules/events/constants/event.constant';
import { UsersService } from 'src/modules/users/services/users.service';

@Controller('orders')
@ApiBearerAuth()
@ApiTags('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly productsService: ProductsService,
    private readonly notificationsService: NotificationsService,
    private readonly statusService: StatusService,
    private readonly eventGateway: OrderEventGateway,
    private readonly usersService: UsersService,
  ) {}

  @Get('/user')
  @Roles(RoleType.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles(RoleType.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
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
    const product = await this.productsService.findById(
      createOrderDto.productId,
    );

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

        this.notificationsService.sendNotificationFirebase(
          notification,
          orderData,
        );
      }

      this.eventGateway.sendToStaff(
        {
          order,
        },
        HANDLE_ORDER_EVENT,
      );

      return order;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update status order',
  })
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
  @Roles(RoleType.VENDOR)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusOrderDto: UpdateStatusOrderDto,
  ): Promise<Order> {
    const order = await this.orderService.findById(id);
    const user = await this.usersService.findUserById(order.user.toString());

    const valueCurrentStatus = order.orderStatus.value;

    const newStatus = await this.statusService.findByValue(
      updateStatusOrderDto.status,
    );
    if (!newStatus) {
      throw new BadRequestException({ description: 'Invalid status' });
    }

    const valueNewStatus = newStatus.value;
    const nameNewStatus = newStatus.name;

    if (
      valueNewStatus === valueCurrentStatus + 1 ||
      (valueCurrentStatus === OrderStatusNumber.NEW &&
        valueNewStatus === OrderStatusNumber.CANCELED)
    ) {
      const updatedOrder = await this.orderService.updateStatus(
        order,
        valueNewStatus,
      );

      if (
        user.deviceToken.length > 0 &&
        valueNewStatus === OrderStatusNumber.READY
      ) {
        const notification: PushNotificationDto = {
          deviceToken: user.deviceToken,
          title: TitleOrder,
          message: `${MessageUpdateOrder} ${nameNewStatus}`,
        };
        const orderData = {
          quantity: order.quantity.toString(),
          price: order.product.price.toString(),
          title: order.product.name,
          status: nameNewStatus,
        };

        this.notificationsService.sendNotificationFirebase(
          notification,
          orderData,
        );
      }

      if (user.webHook && valueNewStatus === OrderStatusNumber.READY) {
        const pushNotificationGoogleChatDto: PushNotificationGoogleChatDto = {
          webHook: user.webHook,
          message: `${MessageUpdateOrder} ${nameNewStatus}`,
        };
        this.notificationsService.sendNotificationToGoogleChat(
          pushNotificationGoogleChatDto,
        );
      }

      this.eventGateway.sendToStaff(
        {
          order: updatedOrder,
          newOrderStatus: nameNewStatus,
        },
        HANDLE_ORDER_EVENT,
      );

      return updatedOrder;
    } else {
      throw new BadRequestException({ description: 'Invalid order status' });
    }
  }
}
