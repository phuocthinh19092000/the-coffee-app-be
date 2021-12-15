import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from '../dto/requests/create-order.dto';
import { UpdateOrderDto } from '../dto/requests/update-order.dto';
import { Order } from '../entities/order.entity';
import { UsersService } from '../../users/services/users.service';
import { UpdateUserDto } from 'src/modules/users/dto/requests/update-user.dto';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderModel.find();
  }

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const freeUnit = user.freeUnit;
    const newFreeUnit = freeUnit - createOrderDto['quantity'];
    const newOrder = new this.orderModel({
      ...createOrderDto,
      quantityBilled: newFreeUnit < 0 ? -newFreeUnit : 0,
      userId: user._id.toString(),
    });
    const updatedUser: UpdateUserDto = {
      freeUnit: newFreeUnit < 0 ? 0 : newFreeUnit,
    };
    await this.usersService.updateFreeUnit(user._id.toString(), updatedUser);
    return newOrder.save();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateOrderDto },
      { new: true },
    );
    return order;
  }
}
