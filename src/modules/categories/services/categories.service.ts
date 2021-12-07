import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.categoryModel.find();
  }

  async findOne(id: string): Promise<Category> {
    const existingCategory = await this.categoryModel
      .findOne({ _id: id })
      .populate('products')
      .exec();
    if (!existingCategory) throw new NotFoundException(`No Category Found`);

    return existingCategory;
  }

  async getProductsByCategoryId(id: string): Promise<Product[]> {
    const existingCategory = await this.findOne(id);
    return existingCategory.products;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const categoryNew = new this.categoryModel(createCategoryDto);
    return categoryNew.save();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const existingCategory = await this.categoryModel
      .findOneAndUpdate({ _id: id }, { $set: updateCategoryDto }, { new: true })
      .exec();
    if (!existingCategory) throw new NotFoundException(`No Category Found`);
    return existingCategory;
  }
  async findByName(name: string): Promise<Category> {
    const existingCategory = await this.categoryModel.findOne({ name });
    if (!existingCategory) {
      throw new NotFoundException('No Category found');
    }
    return existingCategory;
  }
}
