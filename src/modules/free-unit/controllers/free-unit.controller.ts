import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FreeUnitDto } from '../dto/free-unit.dto';
import { FreeUnitService } from '../services/free-unit.service';

@Controller('freeunit')
@ApiTags('freeunit')
export class FreeUnitController {
  constructor(private readonly freeUnitService: FreeUnitService) {}
  @Get()
  @ApiOperation({ summary: 'Get free unit' })
  @ApiOkResponse({ type: FreeUnitDto })
  async getFreeUnit() {
    const freeUnit = await this.freeUnitService.get();
    return freeUnit;
  }

  @Post()
  @ApiOperation({ summary: 'Add free unit' })
  @ApiCreatedResponse({ type: FreeUnitDto })
  async addFreeUnit(@Body() freeUnitDto: FreeUnitDto) {
    const currentFreeUnit = await this.freeUnitService.get();
    if (currentFreeUnit)
      throw new BadRequestException({
        statusCode: 400,
        message: 'Already have free unit',
      });
    return this.freeUnitService.add(freeUnitDto);
  }

  @Put()
  @ApiOperation({ summary: 'Update free unit' })
  @ApiOkResponse({
    description: 'Update Free Unit successfully.',
    type: FreeUnitDto,
  })
  updateFreeUnit(@Body() freeUnitDto: FreeUnitDto) {
    return this.freeUnitService.update(freeUnitDto);
  }
}
