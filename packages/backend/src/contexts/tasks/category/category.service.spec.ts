import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './application/category.service';
import { CategoryRepository } from './domain/category.repository';
import { NotFoundException } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: jest.Mocked<CategoryRepository>;

  const mockCategories = [
    {
      id: '1',
      name: 'Trabajo',
      color: '#FF5733',
      userId: '1',
    },
    {
      id: '2',
      name: 'Personal',
      color: '#33FF57',
      userId: '1',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: {
            findAll: jest.fn(),
            getOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            deleteItem: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get(CategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('return all categories', async () => {
      repository.findAll.mockResolvedValue(mockCategories);

      const result = await service.findAll('1');
      expect(result).toEqual(mockCategories);
      expect(repository.findAll).toHaveBeenCalledWith('1');
    });
  });

  describe('getOne', () => {
    it('throws NotFoundException when category not found', async () => {
      repository.getOne.mockResolvedValue(null);

      await expect(service.getOne('1')).rejects.toThrow(NotFoundException);

      expect(repository.getOne).toHaveBeenCalledWith('1');
    });
  });
});
