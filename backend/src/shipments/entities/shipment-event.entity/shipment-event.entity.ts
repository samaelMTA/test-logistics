
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Shipment } from '../shipment.entity/shipment.entity';
import { User } from '../../../users/entities/user.entity/user.entity';
import { ShipmentStatus } from '../../../common/enums/shipment-status.enum';

@Entity('shipment_events')
export class ShipmentEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Shipment, (shipment) => shipment.events, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'shipmentId' })
    shipment: Shipment;

    @Column()
    shipmentId: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'userId' })
    user?: User;

    @Column({ nullable: true })
    userId?: string;

    @Column({
        type: 'enum',
        enum: ShipmentStatus,
    })
    status: ShipmentStatus;

    @Column()
    location: string;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @CreateDateColumn()
    createdAt: Date;
}