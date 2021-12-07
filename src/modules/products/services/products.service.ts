import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../../products/entities/product.entity';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dto/requests/create-product.dto';
import { UpdateProductDto } from '../dto/requests/update-product.dto';
import { CategoriesService } from '../../categories/services/categories.service';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingCategory = await this.categoriesService.findOne(
      createProductDto.categoryId,
    );

    const productNew = new this.productModel({ ...createProductDto });
    existingCategory.products.push(productNew);
    existingCategory.save();
    return productNew.save();
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productModel
      .findOneAndUpdate({ _id: id }, { $set: updateProductDto }, { new: true })
      .exec();
    if (!existingProduct) throw new NotFoundException(`No Product Found`);
    return existingProduct;
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find();
  }

  async findOne(id: string): Promise<Product> {
    return this.productModel.findById(id);
  }

  async findByName(name: string): Promise<Product> {
    return this.productModel.findOne({ name });
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    return this.productModel.find({ categoryId });
  }
}
