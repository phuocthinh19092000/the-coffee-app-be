import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/requests/create-user.dto';
import { UpdateUserDto } from '../dto/requests/update-user.dto';
import { User } from '../entities/user.entity';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import { AppConfigService } from 'src/common/config/config.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly appConfigService: AppConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto, role: string): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { roleName, ...newUser } = createUserDto;

    newUser['role'] = role;
    newUser['password'] = this.appConfigService.password;

    const user = new this.userModel(newUser);

    return user.save();
  }

  findUserByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserById(_id: string): Promise<User | undefined> {
    return (await this.userModel.findById(_id)).populate('role');
  }

  async updateFreeUnit(id: string, updateUserDto: UpdateUserDto) {
    const order = await this.userModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateUserDto },
      { new: true },
    );
    return order;
  }

  async updateAllFreeUnit(updateUserDto: UpdateUserDto) {
    return this.userModel.updateMany(updateUserDto);
  }

  async addDeviceToken(user: User, deviceToken: string) {
    if (!user.deviceToken.includes(deviceToken)) {
      user.deviceToken.push(deviceToken);
    }
    return user.save();
  }

  async removeDeviceToken(user: User, deviceToken: string) {
    user.deviceToken = user.deviceToken.filter(
      (token) => token !== deviceToken,
    );
    return user.save();
  }

  async updateWebHook(user: User, webHook: string) {
    user.webHook = webHook;
    return user.save();
  }

  async findAllUser(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<{ user: User[]; totalUser: number }> {
    const { limit, offset } = paginationQueryDto;
    const totalUser = await this.userModel.count();
    const user = await this.userModel
      .find()
      .populate('role', 'name')
      .sort({ name: 'asc' })
      .skip(offset)
      .limit(limit)
      .exec();

    return { user, totalUser };
  }
}
