import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity/user.entity';
import { UserRole } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async create(email: string, password: string, role: UserRole): Promise<User> {
        const existingUser = await this.findByEmail(email);

        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const user = this.usersRepository.create({
            email,
            password,
            role,
        });

        return this.usersRepository.save(user);
    }
}