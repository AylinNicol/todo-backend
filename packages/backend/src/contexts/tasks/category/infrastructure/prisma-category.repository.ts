import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/prisma.service';
import { Category } from '../domain/category.entity';
import {
  CreateCategoryData,
  CategoryRepository,
  UpdateCategoryData,
} from '../domain/category.repository';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(row: any) {
    return new Category(row.id, row.name, row.color, row.userId);
  }

  async findAll(userId: string) {
    const rows = await this.prisma.category.findMany({
      where: { userId },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async getOne(id: string) {
    const row = await this.prisma.category.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async create(data: CreateCategoryData) {
    const row = await this.prisma.category.create({ data });
    return this.toDomain(row);
  }

  async update(id: string, data: UpdateCategoryData) {
    const row = await this.prisma.category.update({ where: { id }, data });
    return this.toDomain(row);
  }

  async deleteItem(id: string) {
    await this.prisma.category.delete({ where: { id } });
  }
}
