import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service'
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/request/create-category.dto';
import { UpdateCategoryDto } from '../dto/request/update-category.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    @ApiOkResponse(
        {
            description: 'Get All Categories successfully.',
            type: Category
        }
    )
    findAll(): Promise<Category[]> {
        return this.categoriesService.findAll();
    }

    @Post()
    @ApiCreatedResponse(
        {
            description: 'Create Category successfully.',
            type: Category
        }
    )
    create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoriesService.create(createCategoryDto);
    }

    @Patch(':id')
    @ApiOkResponse(
        {
            description: 'Update Category successfully.',
            type: Category
        }
    )
    @ApiParam({ name: 'id', required: true, description: 'id of category', schema: { type: 'string' } })
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        return this.categoriesService.update(id, updateCategoryDto);
    }
}
