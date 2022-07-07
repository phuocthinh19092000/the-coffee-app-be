import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../entities/product.entity';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dto/requests/create-product.dto';
import { UpdateProductDto } from '../dto/requests/update-product.dto';
import { Category } from '../../categories/entities/category.entity';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import { FileStoragesService } from 'src/modules/file-storage/services/file-storage.sevice';
import { ProductStatus } from '../constants/product.constant';
import { CategoriesService } from 'src/modules/categories/services/categories.service';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    private readonly fileStoragesService: FileStoragesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    category: Category,
    images: Express.Multer.File,
  ): Promise<Product> {
    const productNew = new this.productModel(createProductDto);
    category.products.push(productNew);
    productNew.category = category;
    const imageURL = await this.fileStoragesService.storeFile(images);
    if (images) {
      productNew.images = imageURL;
    }
    category.save();
    return productNew.save();
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    images: Express.Multer.File,
    categoryUpdate: Category,
  ): Promise<Product> {
    const currentProduct = await this.findById(id);
    if (images) {
      const currentImageURL = currentProduct.images;
      if (currentImageURL) {
        const fileName = this.fileStoragesService.getFileName(currentImageURL);
        this.fileStoragesService.deleteFile(fileName);
      }
      updateProductDto.images = await this.fileStoragesService.storeFile(
        images,
      );
    }

    const oldCategory = await this.categoriesService.findOne(
      currentProduct.category.toString(),
    );

    const productUpdated = await this.productModel
      .findOneAndUpdate({ _id: id }, { $set: updateProductDto }, { new: true })
      .exec();

    if (productUpdated.category.id !== categoryUpdate.id) {
      oldCategory.products = oldCategory.products.filter(
        (product) => product.id !== id,
      );
      categoryUpdate.products.push(productUpdated);
      oldCategory.save();
      categoryUpdate.save();
    }

    return productUpdated;
  }
  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<{ products: Product[]; totalProduct: number }> {
    const { limit, offset } = paginationQueryDto;
    const totalProduct = await this.productModel.count();
    const products = await this.productModel
      .find()
      .populate('category', 'name')
      .collation({ locale: 'en' })
      .sort({ name: 'asc' })
      .skip(offset)
      .limit(limit)
      .exec();

    return { products, totalProduct };
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
        status: ProductStatus.inStock,
      })
      .populate('category', 'name')
      .exec();
  }
}
