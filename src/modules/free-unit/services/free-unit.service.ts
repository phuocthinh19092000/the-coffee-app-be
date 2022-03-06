import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FreeUnitDto } from '../dto/free-unit.dto';
import { FreeUnit } from '../entities/free-unit.entity';

@Injectable()
export class FreeUnitService {
  constructor(
    @InjectModel(FreeUnit.name)
    private readonly FreeUnitModel: Model<FreeUnit>,
  ) {}
  async get(): Promise<FreeUnit> {
    return this.FreeUnitModel.findOne();
  }

  async add(freeUnitDto: FreeUnitDto): Promise<FreeUnit> {
    const newFreeUnit = new this.FreeUnitModel(freeUnitDto);
    return newFreeUnit.save();
  }

  async update(freeUnitDto: FreeUnitDto): Promise<FreeUnit> {
    const currentFreeUnit = this.get();
    if (currentFreeUnit) {
      return this.FreeUnitModel.findOneAndUpdate(
        {},
        { $set: freeUnitDto },
        { new: true },
      );
    }
    const newFreeUnit = new this.FreeUnitModel(freeUnitDto);
    return newFreeUnit.save();
  }
}
