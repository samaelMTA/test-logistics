import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { UserRole } from '../common/enums/role.enum';

@Injectable()
export class UsersSeederService implements OnModuleInit {
    private readonly logger = new Logger(UsersSeederService.name);

    constructor(private readonly usersService: UsersService) {}

    async onModuleInit() {
        const supervisorEmail = 'supervisor@translog.com';
        const supervisorPassword = '123456*';

        const existingSupervisor = await this.usersService.findByEmail(supervisorEmail);

        if (existingSupervisor) {
        this.logger.log('Default supervisor already exists');
        return;
        }

        const hashedPassword = await bcrypt.hash(supervisorPassword, 10);

        await this.usersService.create(
        supervisorEmail,
        hashedPassword,
        UserRole.SUPERVISOR,
        );

        this.logger.log('Default supervisor created');
    }
}