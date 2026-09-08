import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'Nombre de la categoría',
    example: 'Trabajo',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Color de la categoría',
    example: '#FF5733',
  })
  @IsString()
  @IsOptional()
  color?: string;
}
