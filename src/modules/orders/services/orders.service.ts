import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from '../dto/requests/create-order.dto';
import { Order } from '../entities/order.entity';
import { UsersService } from '../../users/services/users.service';
import { UpdateUserDto } from 'src/modules/users/dto/requests/update-user.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { StatusService } from 'src/modules/status/services/status.service';
import { PaginationQueryDto } from 'src/modules/shared/dto/pagination-query.dto';
import {
  OrderStatus,
  OrderStatusNumber,
} from 'src/modules/orders/constants/order.constant';
import { UpdateStatusOrderDto } from '../dto/requests/update-status-order.dto';
import { Status } from 'src/modules/status/entities/status.entity';
import {
  HANDLE_ORDER_EVENT,
  ORDER_CANCELED,
} from 'src/modules/events/constants/event.constant';
import { OrderEventGateway } from 'src/modules/events/gateways/order-event.gateway';
import { UpdateOrderDto } from '../dto/requests/update-order.dto';
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    private readonly usersService: UsersService,
    private readonly statusService: StatusService,
    private readonly eventGateway: OrderEventGateway,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: 'desc' }).exec();
  }

  findById(id: string): Promise<Order> {
    return this.orderModel
      .findById(id)
      .populate({ path: 'product', select: ['images', 'price', 'name'] })
      .populate({ path: 'orderStatus', select: ['value', 'name'] })
      .exec();
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

    const startDay = new Date();
    startDay.setHours(0, 0, 0, 0);
    const endDay = new Date();
    endDay.setHours(23, 59, 59, 999);

    const orders = this.orderModel
      .find({ orderStatus: status, createdAt: { $gte: startDay, $lt: endDay } })
      .populate({ path: 'orderStatus', select: ['name', 'value'] })
      .populate({ path: 'product', select: ['images', 'name', 'price'] })
      .populate({ path: 'user', select: ['name', 'phoneNumber', 'avatarUrl'] });
    if (status && statusName === OrderStatus.NEW) {
      return orders.sort({ updateAt: 'asc' });
    } else if (status && statusName !== OrderStatus.NEW) {
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
      { path: 'user', select: ['name', 'phoneNumber', 'avatarUrl'] },
    ]);
  }

  async updateStatus(
    order: Order,
    updateStatusOrderDto: UpdateStatusOrderDto,
    newStatus: Status,
    user: User,
  ) {
    const valueNewStatus = newStatus.value;
    const valueCurrentStatus = order.orderStatus.value;
    const nameCurrentStatus = order.orderStatus.name;
    const isCorrectStatus =
      valueNewStatus === valueCurrentStatus + 1 ||
      ((valueCurrentStatus === OrderStatusNumber.NEW ||
        valueCurrentStatus === OrderStatusNumber.PROCESSING) &&
        valueNewStatus === OrderStatusNumber.CANCELED);
    if (!isCorrectStatus) {
      throw new BadRequestException({ description: 'Invalid order status' });
    }

    const isCancelOrder = valueNewStatus === OrderStatusNumber.CANCELED;
    if (isCancelOrder) {
      if (!updateStatusOrderDto.reason) {
        throw new BadRequestException({
          description: 'Please fill the reason',
          status: 400,
        });
      }

      order.reason = updateStatusOrderDto.reason;
    }

    order.orderStatus = newStatus._id;
    await order.save();
    await order.populate([
      { path: 'orderStatus', select: ['value', 'name'] },
      { path: 'user', select: ['name', 'phoneNumber'] },
    ]);

    this.eventGateway.sendToStaff(
      {
        order,
        newOrderStatus: newStatus.name,
        currentOrderStatus: nameCurrentStatus,
      },
      HANDLE_ORDER_EVENT,
    );

    if (valueNewStatus === OrderStatusNumber.CANCELED) {
      this.eventGateway.sendToCustomer(order, user._id, ORDER_CANCELED);
      const oldFreeUnit = user.freeUnit + order.quantity;
      this.usersService.updateFreeUnit(user._id, {
        freeUnit: oldFreeUnit,
      });
    }

    return order;
  }

  async updateOrder(order: Order, updateOrderDto: UpdateOrderDto) {
    const user = await this.usersService.findUserById(order.user.toString());
    const valueNewStatus = updateOrderDto.status;
    const newStatus = await this.statusService.findByValue(valueNewStatus);
    const valueCurrentStatus = order.orderStatus.value;
    const isCorrectStatus =
      valueCurrentStatus === OrderStatusNumber.NEW &&
      (!valueNewStatus || valueNewStatus === OrderStatusNumber.CANCELED);

    if (!isCorrectStatus) {
      throw new BadRequestException({ description: 'Invalid order status' });
    }

    if (valueNewStatus) {
      order.orderStatus = newStatus._id;
      order.save();
      const newFreeUnit = user.freeUnit + order.quantity;
      this.usersService.updateFreeUnit(user._id, {
        freeUnit: newFreeUnit,
      });
    } else {
      const currentOrderQuantity = order.quantity;
      order = await this.orderModel.findOneAndUpdate(
        { _id: order.id },
        { $set: updateOrderDto },
        { new: true },
      );
      const newFreeUnit = updateOrderDto.quantity
        ? user.freeUnit + currentOrderQuantity - updateOrderDto.quantity
        : user.freeUnit;
      this.usersService.updateFreeUnit(user._id, {
        freeUnit: newFreeUnit,
      });
    }
    await order.populate([
      { path: 'orderStatus', select: ['value', 'name'] },
      { path: 'user', select: ['name', 'phoneNumber'] },
    ]);
    this.eventGateway.sendToStaff(
      {
        order: order,
      },
      HANDLE_ORDER_EVENT,
    );

    return order;
  }

  getListOrderByDateRange(param, paginationQueryDto?: PaginationQueryDto) {
    const { limit, offset } = paginationQueryDto;
    const endAt: Date = new Date(param.from);
    const startAt: Date = new Date(param.to);
    const listOrder = this.orderModel
      .find({
        createdAt: { $gte: startAt, $lt: endAt },
      })
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: 'asc' });
    return listOrder.populate([
      { path: 'user', select: ['name'] },
      { path: 'orderStatus', select: ['name', 'value'] },
      { path: 'product', select: ['name'] },
    ]);
  }
}
