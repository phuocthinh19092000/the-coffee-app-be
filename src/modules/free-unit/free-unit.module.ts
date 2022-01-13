import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FreeUnitController } from './controllers/free-unit.controller';
import { FreeUnit, FreeUnitSchema } from './entities/free-unit.entity';
import { FreeUnitService } from './services/free-unit.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FreeUnit.name,
        schema: FreeUnitSchema,
      },
    ]),
  ],
  controllers: [FreeUnitController],
  providers: [FreeUnitService],
  exports: [FreeUnitService],
})
export class FreeUnitModule {}
