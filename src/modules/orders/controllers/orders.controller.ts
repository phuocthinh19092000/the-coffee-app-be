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
import { ProductsService } from 'src/modules/products/services/products.service';
import { StatusService } from 'src/modules/status/services/status.service';
import { OrderStatus } from '../constants/order.constant';
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
    private readonly statusService: StatusService,
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
  findByUserId(@User() user): Promise<Order[]> {
    return this.orderService.findByUserId(user);
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
      return await this.orderService.create(createOrderDto, user);
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
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusOrderDto: UpdateStatusOrderDto,
  ): Promise<Order> {
    const order = await this.orderService.findById(id);
    const currentStatus = order.statusId.value;
    const newStatus = updateStatusOrderDto.status;

    if (
      newStatus === currentStatus + 1 ||
      (currentStatus === 0 && newStatus === -1)
    ) {
      return this.orderService.updateStatus(order, newStatus);
    } else {
      throw new BadRequestException({ description: 'Invalid order status' });
    }
  }
}
