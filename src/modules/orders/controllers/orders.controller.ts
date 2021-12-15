import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ProductsService } from 'src/modules/products/services/products.service';
import { CreateOrderDto } from '../dto/requests/create-order.dto';
import { UpdateOrderDto } from '../dto/requests/update-order.dto';
import { Order } from '../entities/order.entity';
import { OrdersService } from '../services/orders.service';

@Controller('orders')
@ApiBearerAuth()
@ApiTags('orders')
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    private readonly productsService: ProductsService,
  ) {}

  @ApiOperation({ description: 'Get all orders' })
  @Get()
  @ApiOkResponse({
    description: 'Get orders successfully',
    type: [Order],
  })
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

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
    if (!product)
      throw new BadRequestException({
        description: 'Wrong product ID',
        status: 400,
      });
    try {
      return this.orderService.create(createOrderDto, user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Update Order successfully',
    type: UpdateOrderDto,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of Order',
    type: String,
  })
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.update(id, updateOrderDto);
  }
}
