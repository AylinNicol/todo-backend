import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserRepository, UserUpdateData } from '../domain/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { toSafeUser, toSafeUsers } from '../domain/user.entity';
import { NotificationPort } from 'src/contexts/tasks/todo/domain/notification.port';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly notificationPort: NotificationPort,
  ) {}

  async findAll() {
    const users = await this.userRepository.findAll();
    return toSafeUsers(users);
  }

  async create(dto: CreateUserDto, userId: string) {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await argon2.hash(dto.password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    const user = await this.userRepository.create({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
      role: 'CLIENT',
      status: 'ACTIVE',
    });

    await this.notificationPort.send({
      userId,
      type: 'TASK_CREATED',
      title: 'Nuevo usuario',
      message: `Se creó el usuario "${dto.name}"`,
      metadata: { user: toSafeUser(user) },
    });

    return toSafeUser(user);
  }

  async getOne(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return toSafeUser(user);
  }

  async update(
    id: string,
    dto: UserUpdateData,
    currentUser: { id: string; role: 'CLIENT' | 'ADMIN' },
  ) {
    await this.getOne(id);
    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException(
        'No tienes permiso para actualizar este usuario',
      );
    }
    const data: UserUpdateData = { ...dto };
    if (dto.password) {
      data.password = await argon2.hash(dto.password, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
      });
    }
    const user = await this.userRepository.update(id, data);
    return user ? toSafeUser(user) : null;
  }

  async delete(
    id: string,
    currentUser: { id: string; role: 'CLIENT' | 'ADMIN' },
  ) {
    await this.getOne(id);
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('No tienes permiso para eliminar usuarios');
    }
    return this.userRepository.delete(id);
  }
}
