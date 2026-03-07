
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ShipmentStatus } from '../../../common/enums/shipment-status.enum';
import { ShipmentEvent } from '../shipment-event.entity/shipment-event.entity';
@Entity('shipments')
export class Shipment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    trackingCode: string;

    @Column()
    originAddress: string;

    @Column()
    destinationAddress: string;

    @Column()
    recipientName: string;

    @Column({ nullable: true })
    phone?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    weight: number;

    @Column({
        type: 'enum',
        enum: ShipmentStatus,
        default: ShipmentStatus.CREATED,
    })
    status: ShipmentStatus;

    @Column({ type: 'timestamp', nullable: true })
    deliveredAt?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => ShipmentEvent, (event) => event.shipment, { cascade: true })
    events: ShipmentEvent[];
}