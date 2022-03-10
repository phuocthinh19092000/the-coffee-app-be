import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStatusDto } from '../dto/request/create-status.dto';
import { Status } from '../entities/status.entity';

@Injectable()
export class StatusService {
  constructor(
    @InjectModel(Status.name)
    private readonly statusModel: Model<Status>,
  ) {}

  async findAll(): Promise<Status[]> {
    return this.statusModel.find();
  }

  async findByName(statusName: string): Promise<Status> {
    return this.statusModel.findOne({ name: statusName });
  }

  async findByValue(statusValue: number): Promise<Status> {
    return this.statusModel.findOne({ value: statusValue });
  }

  async findById(id: string): Promise<Status> {
    return this.statusModel.findById(id);
  }

  async createStatus(createStatusDto: CreateStatusDto): Promise<Status> {
    const status = new this.statusModel(createStatusDto);
    return status.save();
  }
}
