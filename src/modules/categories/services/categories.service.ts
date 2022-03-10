import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/modules/products/entities/product.entity';
import { PaginationQueryDto } from 'src/modules/shared/dto/pagination-query.dto';
import { CreateCategoryDto } from '../dto/request/create-category.dto';
import { UpdateCategoryDto } from '../dto/request/update-category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async findAll(
    paginationQueryDto?: PaginationQueryDto,
  ): Promise<Category[] | { categories: Category[]; totalCategories: number }> {
    if (Object.keys(paginationQueryDto).length) {
      const totalCategories = await this.categoryModel.count();
      const { limit, offset } = paginationQueryDto;
      const categories = await this.categoryModel
        .find()
        .sort({ name: 'asc' })
        .collation({ locale: 'en' })
        .skip(offset)
        .limit(limit);
      return { categories, totalCategories };
    }
    return this.categoryModel.find().sort({ name: 0 });
  }

  async findOne(id: string): Promise<Category> {
    return await this.categoryModel.findById(id).populate('products').exec();
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const category = await this.categoryModel.findById(categoryId).populate({
      path: 'products',
      options: { sort: { name: 1 } },
    });

    return category.products;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const categoryNew = new this.categoryModel(createCategoryDto);
    return categoryNew.save();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoryModel
      .findOneAndUpdate({ _id: id }, { $set: updateCategoryDto }, { new: true })
      .exec();
  }
  async findByName(name: string): Promise<Category> {
    return this.categoryModel.findOne({ name });
  }
}
