import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/requests/create-user.dto';
import { User } from '../entities/user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findUserByUserName(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username });
  }

  async findUserById(_id: string): Promise<User | undefined> {
    return this.userModel.findById(_id);
  }
}
