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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/requests/create-product.dto';
import { CategoriesService } from 'src/modules/categories/services/categories.service';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import { ImageFileType } from 'src/modules/shared/constants/file-types.constant';
import { UpdateProductDto } from '../dto/requests/update-product.dto';
import { FileStoragesService } from 'src/modules/file-storage/services/file-storage.sevice';
import { RegexDownloadURL } from 'src/modules/file-storage/constants/regex.constant';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleType } from 'src/modules/roles/constants/role.constant';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
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
  findAll(
    @Query() paginationQueryDto: PaginationQueryDto,
  ): Promise<{ products: Product[]; totalProduct: number }> {
    return this.productsService.findAll(paginationQueryDto);
  }

  @Roles(RoleType.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
    if (!ImageFileType.includes(images?.mimetype)) {
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

  @Roles(RoleType.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update product' })
  @UseInterceptors(FileInterceptor('images'))
  @Patch(':id')
  @ApiOkResponse({
    description: 'Update product successfully.',
    type: Product,
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of product',
    type: String,
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() images: Express.Multer.File,
  ) {
    const product = await this.productsService.findById(id);
    if (!product) {
      throw new BadRequestException({
        description: 'Product does not exist',
        status: 400,
      });
    }
    const currentProductName = product.name;
    const existedProduct = await this.productsService.findByName(
      updateProductDto.name,
    );
    if (currentProductName !== updateProductDto.name && existedProduct) {
      throw new BadRequestException({
        description: 'Product name already exists',
        status: 400,
      });
    }
    const category = await this.categoriesService.findOne(
      updateProductDto.categoryId,
    );
    if (!category) {
      throw new BadRequestException({
        description: 'Category not existed',
        status: 400,
      });
    }
    if (
      !RegexDownloadURL.test(product.images) &&
      !ImageFileType.includes(images?.mimetype)
    ) {
      throw new BadRequestException({
        description: 'Incorrect File Type',
        status: 400,
      });
    }
    try {
      return this.productsService.update(id, updateProductDto, images);
    } catch (e) {
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
