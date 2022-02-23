import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from '../dto/requests/create-order.dto';
import { Order } from '../entities/order.entity';
import { UsersService } from '../../users/services/users.service';
import { UpdateUserDto } from 'src/modules/users/dto/requests/update-user.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { StatusService } from 'src/modules/status/services/status.service';
import { PaginationQueryDto } from 'src/modules/shared/dto/pagination-query.dto';
import { OrderStatus } from 'src/modules/orders/constants/order.constant';
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    private readonly usersService: UsersService,
    private readonly statusService: StatusService,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: 'desc' }).exec();
  }

  findByUserId(
    user: User,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Order[]> {
    const { limit, offset } = paginationQueryDto;
    return this.orderModel
      .find({ user: user._id })
      .populate({ path: 'orderStatus', select: ['name', 'value'] })
      .populate({ path: 'product', select: ['images', 'name', 'price'] })
      .sort({ createdAt: 'desc' })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findByStatus(statusName: string): Promise<Order[]> {
    const status = await this.statusService.findByName(statusName);
    const orders = this.orderModel
      .find({ orderStatus: status })
      .populate({ path: 'orderStatus', select: ['name', 'value'] })
      .populate({ path: 'product', select: ['images', 'name', 'price'] })
      .populate({ path: 'user', select: ['name', 'phoneNumber'] });
    if (status && statusName === OrderStatus.new) {
      return orders.sort({ updateAt: 'asc' });
    } else if (status && statusName !== OrderStatus.new) {
      return orders.sort({ updateAt: 'asc' });
    }
    return [];
  }

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const freeUnit = user.freeUnit;
    const newFreeUnit = freeUnit - createOrderDto['quantity'];
    const statusNew = await this.statusService.findByName('new');

    const newOrder = new this.orderModel({
      ...createOrderDto,
      product: createOrderDto.productId,
      quantityBilled: newFreeUnit < 0 ? -newFreeUnit : 0,
      user: user._id,
      orderStatus: statusNew._id,
    });
    await newOrder.save();

    const updatedUser: UpdateUserDto = {
      freeUnit: newFreeUnit < 0 ? 0 : newFreeUnit,
    };
    await this.usersService.updateFreeUnit(user._id, updatedUser);

    return newOrder.populate([
      { path: 'product', select: ['images', 'price', 'name'] },
      { path: 'orderStatus', select: ['value', 'name'] },
      { path: 'user', select: ['name', 'phoneNumber'] },
    ]);
  }

  async updateStatus(order: Order, newStatus: number) {
    const status = await this.statusService.findByValue(newStatus);
    order.orderStatus = status._id;
    await order.save();
    return order.populate([
      { path: 'orderStatus', select: ['value', 'name'] },
      { path: 'user', select: ['name', 'phoneNumber'] },
    ]);
  }

  findById(id: string): Promise<Order> {
    return this.orderModel
      .findById(id)
      .populate({ path: 'product', select: ['images', 'price', 'name'] })
      .populate({ path: 'orderStatus', select: ['value', 'name'] })
      .exec();
  }
}
