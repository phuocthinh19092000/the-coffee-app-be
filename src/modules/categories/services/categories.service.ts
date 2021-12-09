import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/modules/products/entities/product.entity';
import { CreateCategoryDto } from '../dto/request/create-category.dto';
import { UpdateCategoryDto } from '../dto/request/update-category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().populate('products');
  }

  async findOne(name: string): Promise<Category> {
    return await this.categoryModel
      .findOne({ name: name.toLowerCase() })
      .populate('products')
      .exec();
  }

  async getProductsByCategoryName(name: string): Promise<Product[]> {
    const category = await this.findOne(name);
    return category.products;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    createCategoryDto.name.toLowerCase();
    const categoryNew = new this.categoryModel(createCategoryDto);
    return categoryNew.save();
  }

  async update(
    name: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryModel
      .findOneAndUpdate(
        { name: name },
        { $set: updateCategoryDto },
        { new: true },
      )
      .exec();

    return category;
  }
  async findByName(name: string): Promise<Category> {
    return await this.categoryModel.findOne({ name });
  }
}
