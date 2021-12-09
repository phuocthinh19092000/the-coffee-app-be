import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/request/create-category.dto';
import { UpdateCategoryDto } from '../dto/request/update-category.dto';
import { Product } from '../../products/entities/product.entity';
import {
  ApiCreatedResponse,
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
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':name')
  @ApiOkResponse({
    description: 'Get category by category Name successfully',
    type: Category,
  })
  @ApiParam({
    name: 'name',
    required: true,
    description: 'name of category',
    type: String,
  })
  findOne(@Param('name') name: string): Promise<Category> {
    return this.categoriesService.findOne(name);
  }

  @Get(':name/products')
  @ApiOkResponse({
    description: 'Get list products by category Name successfully.',
    type: Product,
  })
  @ApiParam({
    name: 'name',
    required: true,
    description: 'name of category',
    type: String,
  })
  getProductsByCategoryName(@Param('name') name: string): Promise<Product[]> {
    return this.categoriesService.getProductsByCategoryName(name);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Create Category successfully.',
    type: Category,
  })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':name')
  @ApiOkResponse({
    description: 'Update Category successfully.',
    type: Category,
  })
  @ApiParam({
    name: 'name',
    required: true,
    description: 'name of category',
    type: String,
  })
  update(
    @Param('name') name: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(name, updateCategoryDto);
  }
}
