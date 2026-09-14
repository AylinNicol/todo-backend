import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({
    description: 'Título de la tarea',
    example: 'Comprar pan',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Descripción de la tarea',
    example: 'Comprar pan en la tienda cercana',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Fecha límite de la tarea (ISO 8601)',
    example: '2026-09-15T10:00:00.000Z',
  })
  @IsOptional()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría asociada a la tarea',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsOptional()
  categoryId?: string;
}
