import { Injectable } from '@nestjs/common';
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
    const category = await this.categoriesService.findOne(
      createProductDto.categoryName,
    );
    const productNew = new this.productModel(createProductDto);
    category.products.push(productNew);
    category.save();
    return productNew.save();
  }

  async update(
    name: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productModel
      .findOneAndUpdate(
        { name: name },
        { $set: updateProductDto },
        { new: true },
      )
      .exec();
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.find();
  }

  async findOne(name: string): Promise<Product> {
    return await this.productModel.findOne({ name });
  }

  async findById(id: string): Promise<Product> {
    return await this.productModel.findById(id);
  }

  async searchByName(name: string): Promise<Product[]> {
    return await this.productModel.find({
      name: new RegExp(name, 'i'),
    });
  }
}
