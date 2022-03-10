import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/request/create-category.dto';
import { UpdateCategoryDto } from '../dto/request/update-category.dto';
import { Product } from '../../products/entities/product.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/modules/shared/dto/pagination-query.dto';
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Get All Categories' })
  @Get()
  @ApiOkResponse({
    description: 'Get All Categories successfully.',
    type: [Category],
  })
  findAll(
    @Query() paginationQueryDto?: PaginationQueryDto,
  ): Promise<Category[] | { categories: Category[]; totalCategories: number }> {
    return this.categoriesService.findAll(paginationQueryDto);
  }

  @ApiOperation({ summary: 'Get Category By Id' })
  @Get(':id')
  @ApiOkResponse({
    description: 'Get category by category id successfully',
    type: Category,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of category',
    type: String,
  })
  async findOne(@Param('id') id: string): Promise<Category> {
    return await this.categoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Get list products of categoryID' })
  @Get(':id/products')
  @ApiOkResponse({
    description: 'Get list products by category id successfully.',
    type: [Product],
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of category',
    type: String,
  })
  async getProductsByCategoryId(@Param('id') id: string): Promise<Product[]> {
    return this.categoriesService.getProductsByCategory(id);
  }

  @ApiOperation({ summary: 'Create new category' })
  @Post()
  @ApiCreatedResponse({
    description: 'Create Category successfully.',
    type: Category,
  })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoriesService.findByName(
      createCategoryDto.name,
    );
    if (category)
      throw new BadRequestException({
        description: 'Category name already existed',
        status: 400,
      });
    try {
      return this.categoriesService.create(createCategoryDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOperation({ summary: 'Update Category' })
  @Patch(':id')
  @ApiOkResponse({
    description: 'Update Category successfully.',
    type: Category,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of category',
    type: String,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoriesService.findByName(
      updateCategoryDto.name,
    );
    if (category)
      throw new BadRequestException({
        description: 'Category name already existed',
        status: 400,
      });
    try {
      return this.categoriesService.update(id, updateCategoryDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
