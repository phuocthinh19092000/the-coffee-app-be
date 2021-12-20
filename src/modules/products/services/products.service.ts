import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../../products/entities/product.entity';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dto/requests/create-product.dto';
import { UpdateProductDto } from '../dto/requests/update-product.dto';
import { Category } from '../../categories/entities/category.entity';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    category: Category,
  ): Promise<Product> {
    const productNew = new this.productModel(createProductDto);
    category.products.push(productNew);
    productNew.category = category;
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
    return await this.productModel.find().populate('category', 'name');
  }

  async findByName(name: string): Promise<Product> {
    return await this.productModel
      .findOne({ name })
      .populate('category', 'name');
  }

  async findById(id: string): Promise<Product> {
    return await this.productModel.findById(id);
  }

  async searchByName(name: string): Promise<Product[]> {
    return await this.productModel
      .find({
        name: new RegExp(name, 'i'),
      })
      .populate('category', 'name');
  }
}
