import { RolesGuard } from '../../../guards/roles.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
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
  OrderStatus,
  TitleOrder,
} from '../constants/order.constant';
import { PaginationQueryDto } from 'src/modules/shared/dto/pagination-query.dto';
import { CreateOrderDto } from '../dto/requests/create-order.dto';
import { UpdateOrderDto } from '../dto/requests/update-order.dto';
import { UpdateStatusOrderDto } from '../dto/requests/update-status-order.dto';
import { Order } from '../entities/order.entity';
import { OrdersService } from '../services/orders.service';
import { StatusService } from 'src/modules/status/services/status.service';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleType } from 'src/modules/roles/constants/role.constant';
import { OrderEventGateway } from 'src/modules/events/gateways/order-event.gateway';
import { HANDLE_ORDER_EVENT } from 'src/modules/events/constants/event.constant';
import { UsersService } from 'src/modules/users/services/users.service';
import { ProductStatus } from 'src/modules/products/constants/product.constant';

@UseGuards(JwtAuthGuard)
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
  @UseGuards(RolesGuard)
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

    if (product.status === ProductStatus.outOfStock) {
      throw new BadRequestException({
        description:
          'Thanks for your order! Unfortunately, the drink from your order are out of stock',
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
          image: product.images,
        };

        await this.notificationsService.sendNotificationFirebase(
          notification,
          orderData,
        );
      }

      await this.eventGateway.sendToStaff(
        {
          order: order,
          newOrderStatus: 'new',
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

    if (!order) {
      throw new BadRequestException({ description: 'Order not exist' });
    }

    const user = await this.usersService.findUserById(order.user.toString());

    const newStatus = await this.statusService.findByValue(
      updateStatusOrderDto.status,
    );
    if (!newStatus) {
      throw new BadRequestException({ description: 'Invalid status' });
    }

    const updatedOrder = await this.orderService.updateStatus(
      order,
      updateStatusOrderDto,
      newStatus,
      user,
    );

    try {
      this.notificationsService.sendNotificationUpdateStatusOrder(
        order,
        newStatus,
        user,
      );
    } catch (err) {
      Logger.error(err);
    }

    return updatedOrder;
  }

  @Patch('/me/:id')
  @ApiOperation({
    summary: 'Update order',
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
  @Roles(RoleType.CUSTOMER, RoleType.ADMIN)
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.orderService.findById(id);

    if (!order) {
      throw new BadRequestException({ description: 'Order not exist' });
    }

    const updateOrder = await this.orderService.updateOrder(
      order,
      updateOrderDto,
    );

    return updateOrder;
  }
}
