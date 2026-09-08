import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CategoryRepository,
  UpdateCategoryData,
} from '../domain/category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll() {
    return this.categoryRepository.findAll();
  }

  async getOne(id: string) {
    const category = await this.categoryRepository.getOne(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async create(userId: string, dto: CreateCategoryDto) {
    const category = await this.categoryRepository.create({
      name: dto.name,
      color: dto.color ?? null,
      userId,
    });

    return category;
  }

  async update(id: string, dto: UpdateCategoryData) {
    await this.getOne(id);
    return this.categoryRepository.update(id, dto);
  }

  async deleteItem(id: string) {
    await this.getOne(id);
    return this.categoryRepository.deleteItem(id);
  }
}
