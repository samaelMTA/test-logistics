
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../../common/enums/role.enum';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.OPERATOR,
    })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;
}