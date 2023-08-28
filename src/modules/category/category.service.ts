import { Category } from './entities/category.entity';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import AppError from 'src/error/AppError';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, isAdmin: boolean) {
    if (!isAdmin) {
      throw new AppError('You do not have permission for this feature', 401);
    }

    const alreadyExists = await this.categoriesRepository.exist({
      where: {
        name: createCategoryDto.name,
      },
    });

    if (alreadyExists) {
      throw new AppError('This category already exists', 401);
    }

    const categoryCreated = await this.categoriesRepository.save({
      ...createCategoryDto,
    });

    console.log(categoryCreated);

    return categoryCreated;
  }

  async findAll() {
    const allCategories = await this.categoriesRepository.find();

    return allCategories;
  }
}
