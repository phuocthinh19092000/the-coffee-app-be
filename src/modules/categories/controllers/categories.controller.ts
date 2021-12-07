import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/request/create-category.dto';
import { UpdateCategoryDto } from '../dto/request/update-category.dto';
import { Product } from '../../products/entities/product.entity';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOkResponse({
    description: 'Get All Categories successfully.',
    type: Category,
  })
  @ApiNotFoundResponse({ description: 'No Category Found' })
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get category by categoryId successfully',
    type: Category,
  })
  @ApiNotFoundResponse({ description: 'No Category Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of category',
    type: String,
  })
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Get(':id/products')
  @ApiOkResponse({
    description: 'Get list products by categoryId successfully.',
    type: Product,
  })
  @ApiNotFoundResponse({ description: 'No Category Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of category',
    type: String,
  })
  getProductsByCategoryId(@Param('id') id: string): Promise<Product[]> {
    return this.categoriesService.getProductsByCategoryId(id);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Create Category successfully.',
    type: Category,
  })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

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
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }
}
