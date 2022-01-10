import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from '../dto/create-role.dto';
import { Role } from '../entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async findByName(name: string): Promise<Role> {
    return await this.roleModel.findOne({ name });
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new this.roleModel(createRoleDto);
    return await role.save();
  }
}
