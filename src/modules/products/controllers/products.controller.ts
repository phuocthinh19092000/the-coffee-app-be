import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/requests/create-product.dto';
import { CategoriesService } from 'src/modules/categories/services/categories.service';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import { ImageFileType } from 'src/modules/shared/constants/file-types.constant';
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @ApiOperation({ summary: 'Get All Products' })
  @Get()
  @ApiOkResponse({
    description: 'Get All Products successfully.',
    type: [Product],
  })
  findAll(@Query() paginationQueryDto: PaginationQueryDto): Promise<Product[]> {
    return this.productsService.findAll(paginationQueryDto);
  }

  @ApiOperation({ summary: 'Create new product' })
  @UseInterceptors(FileInterceptor('images'))
  @Post()
  @ApiCreatedResponse({
    description: 'Create Product successfully.',
    type: Product,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() images: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.productsService.findByName(
      createProductDto.name,
    );

    if (product) {
      throw new BadRequestException({
        description: 'Product name existed',
        status: 400,
      });
    }
    const category = await this.categoriesService.findOne(
      createProductDto.categoryId,
    );
    if (!category) {
      throw new BadRequestException({
        description: 'Category not existed',
        status: 400,
      });
    }
    if (!ImageFileType.includes(images.mimetype)) {
      throw new BadRequestException({
        description: 'Incorrect File Type',
        status: 400,
      });
    }
    try {
      return this.productsService.create(createProductDto, category, images);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  @ApiOperation({ summary: 'Search product by name' })
  @Get('/search')
  @ApiOkResponse({
    description: 'Search product successfully.',
    type: [Product],
  })
  search(@Query('keyword') keyword: string): Promise<Product[]> {
    return this.productsService.searchByName(keyword);
  }
}
