import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity/shipment.entity';
import { ShipmentEvent } from './entities/shipment-event.entity/shipment-event.entity';
import { CreateShipmentDto } from './../auth/dto/create-shipment.dto';
import { ShipmentQueryDto } from './../auth/dto/shipment-query.dto';
import { ShipmentStatus } from '../common/enums/shipment-status.enum';

@Injectable()
export class ShipmentsService {
    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentsRepository: Repository<Shipment>,
        @InjectRepository(ShipmentEvent)
        private readonly shipmentEventsRepository: Repository<ShipmentEvent>,
    ) { }

    private async generateTrackingCode(): Promise<string> {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const datePart = `${yyyy}${mm}${dd}`;

        const prefix = `ENV-${datePart}-`;

        const countToday = await this.shipmentsRepository
            .createQueryBuilder('shipment')
            .where('shipment.trackingCode LIKE :prefix', { prefix: `${prefix}%` })
            .getCount();

        const sequence = String(countToday + 1).padStart(4, '0');

        return `${prefix}${sequence}`;
    }

    async create(createShipmentDto: CreateShipmentDto, userId: string) {
        const trackingCode = await this.generateTrackingCode();

        const shipment = this.shipmentsRepository.create({
            ...createShipmentDto,
            trackingCode,
            status: ShipmentStatus.CREATED,
        });

        const savedShipment = await this.shipmentsRepository.save(shipment);

        const event = this.shipmentEventsRepository.create({
            shipmentId: savedShipment.id,
            userId,
            status: ShipmentStatus.CREATED,
            location: 'System',
            notes: 'Shipment created',
        });

        await this.shipmentEventsRepository.save(event);

        return this.findOne(savedShipment.id);
    }

    async findAll(queryDto: ShipmentQueryDto) {
        const { page = 1, limit = 10, status } = queryDto;

        const queryBuilder = this.shipmentsRepository.createQueryBuilder('shipment');

        if (status) {
            queryBuilder.where('shipment.status = :status', { status });
        }

        queryBuilder.orderBy('shipment.createdAt', 'DESC');
        queryBuilder.skip((page - 1) * limit).take(limit);

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const shipment = await this.shipmentsRepository.findOne({
            where: { id },
            relations: {
                events: true,
            },
            order: {
                events: {
                    createdAt: 'ASC',
                },
            },
        });

        if (!shipment) {
            throw new NotFoundException('Shipment not found');
        }

        return shipment;
    }
}
