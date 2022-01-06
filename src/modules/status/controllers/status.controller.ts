import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateStatusDto } from '../dto/request/create-status.dto';
import { Status } from '../entities/status.entity';
import { StatusService } from '../services/status.service';

@Controller('status')
@ApiTags('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  @ApiOperation({ summary: 'Get all status' })
  @ApiOkResponse({ type: [Status] })
  @ApiInternalServerErrorResponse()
  async getAllStatus() {
    return this.statusService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create new status' })
  @ApiCreatedResponse({
    description: 'Create Status successfully.',
    type: Status,
  })
  @ApiBadRequestResponse({ description: 'Status already existed' })
  @ApiInternalServerErrorResponse()
  async create(@Body() createStatusDto: CreateStatusDto): Promise<Status> {
    const status = await this.statusService.findByName(createStatusDto.name);

    if (status) {
      throw new BadRequestException({ description: 'Status already existed' });
    }

    return this.statusService.createStatus(createStatusDto);
  }
}
