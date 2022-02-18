import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../entities/product.entity';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dto/requests/create-product.dto';
import { UpdateProductDto } from '../dto/requests/update-product.dto';
import { Category } from '../../categories/entities/category.entity';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
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
    await category.save();
    return productNew.save();
  }

  update(name: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productModel
      .findOneAndUpdate(
        { name: name },
        { $set: updateProductDto },
        { new: true },
      )
      .exec();
  }
  findAll(paginationQueryDto: PaginationQueryDto): Promise<Product[]> {
    const { limit, offset } = paginationQueryDto;
    return this.productModel
      .find()
      .populate('category', 'name')
      .sort({ createdAt: 'desc' })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  findByName(name: string): Promise<Product> {
    return this.productModel
      .findOne({ name })
      .populate('category', 'name')
      .exec();
  }

  findById(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();
  }

  searchByName(name: string): Promise<Product[]> {
    return this.productModel
      .find({
        name: new RegExp(name, 'i'),
      })
      .populate('category', 'name')
      .exec();
  }
}
