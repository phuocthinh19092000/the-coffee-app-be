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

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    private readonly usersService: UsersService,
    private readonly statusService: StatusService,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderModel.find().sort({ createdAt: 'desc' });
  }

  async findByUserId(
    user: User,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Order[]> {
    const { limit, offset } = paginationQueryDto;
    return await this.orderModel
      .find({ userId: user._id })
      .populate({ path: 'orderStatus', select: ['name', 'value'] })
      .populate({ path: 'product', select: ['images', 'name', 'price'] })
      .sort({ createdAt: 'desc' })
      .skip(offset)
      .limit(limit);
  }

  async findByStatus(statusName: string): Promise<Order[]> {
    const status = await this.statusService.findByName(statusName);
    if (status) {
      return await this.orderModel
        .find({ orderStatus: status })
        .sort({ createdAt: 'desc' });
    }
    return [];
  }

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const freeUnit = user.freeUnit;
    const newFreeUnit = freeUnit - createOrderDto['quantity'];
    const statusNew = await this.statusService.findByName('new');

    const newOrder = new this.orderModel({
      ...createOrderDto,
      quantityBilled: newFreeUnit < 0 ? -newFreeUnit : 0,
      userId: user._id,
      orderStatus: statusNew._id,
    });

    const updatedUser: UpdateUserDto = {
      freeUnit: newFreeUnit < 0 ? 0 : newFreeUnit,
    };

    this.usersService.updateFreeUnit(user._id, updatedUser);
    return newOrder.save();
  }

  async updateStatus(order: Order, newStatus: number) {
    const status = await this.statusService.findByValue(newStatus);
    order.orderStatus = status._id;
    return order.save();
  }

  async findById(id: string): Promise<Order> {
    return await this.orderModel
      .findById(id)
      .populate({ path: 'product', select: ['price', 'name'] })
      .populate({ path: 'orderStatus', select: ['value', 'name'] });
  }
}
