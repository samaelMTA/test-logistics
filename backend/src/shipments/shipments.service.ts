import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from './entities/shipment.entity/shipment.entity';
import { ShipmentEvent } from './entities/shipment-event.entity/shipment-event.entity';
import { CreateShipmentDto } from './../auth/dto/create-shipment.dto';
import { ShipmentQueryDto } from './../auth/dto/shipment-query.dto';
import { UpdateShipmentStatusDto } from './../auth/dto/update-shipment-status.dto';
import { ShipmentStatus } from '../common/enums/shipment-status.enum';


@Injectable()
export class ShipmentsService {
    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentsRepository: Repository<Shipment>,
        @InjectRepository(ShipmentEvent)
        private readonly shipmentEventsRepository: Repository<ShipmentEvent>,
    ) { }

    private readonly allowedTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
        [ShipmentStatus.CREATED]: [
            ShipmentStatus.IN_WAREHOUSE,
            ShipmentStatus.CANCELLED,
        ],
        [ShipmentStatus.IN_WAREHOUSE]: [
            ShipmentStatus.IN_TRANSIT,
            ShipmentStatus.RETURNED,
            ShipmentStatus.CANCELLED,
        ],
        [ShipmentStatus.IN_TRANSIT]: [
            ShipmentStatus.OUT_FOR_DELIVERY,
            ShipmentStatus.RETURNED,
            ShipmentStatus.CANCELLED,
        ],
        [ShipmentStatus.OUT_FOR_DELIVERY]: [
            ShipmentStatus.DELIVERED,
            ShipmentStatus.RETURNED,
            ShipmentStatus.CANCELLED,
        ],
        [ShipmentStatus.DELIVERED]: [],
        [ShipmentStatus.RETURNED]: [
            ShipmentStatus.CANCELLED,
        ],
        [ShipmentStatus.CANCELLED]: [],
    };

    async updateStatus(
        id: string,
        updateShipmentStatusDto: UpdateShipmentStatusDto,
        userId: string,
    ) {
        const shipment = await this.shipmentsRepository.findOne({
            where: { id },
        });

        if (!shipment) {
            throw new NotFoundException('Shipment not found');
        }

        const { status, location, notes } = updateShipmentStatusDto;

        if (shipment.status === status) {
            throw new BadRequestException('Shipment is already in this status');
        }

        const allowedNextStatuses = this.allowedTransitions[shipment.status] || [];

        if (!allowedNextStatuses.includes(status)) {
            throw new BadRequestException(
                `Invalid status transition from ${shipment.status} to ${status}`,
            );
        }

        shipment.status = status;

        if (status === ShipmentStatus.DELIVERED) {
            shipment.deliveredAt = new Date();
        }

        const updatedShipment = await this.shipmentsRepository.save(shipment);

        const event = this.shipmentEventsRepository.create({
            shipmentId: shipment.id,
            userId,
            status,
            location,
            notes,
        });

        await this.shipmentEventsRepository.save(event);

        return this.findOne(updatedShipment.id);
    }

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
            weight: createShipmentDto.weight.toString(),
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

    async cancel(id: string, userId: string) {
        const shipment = await this.shipmentsRepository.findOne({
            where: { id },
        });

        if (!shipment) {
            throw new NotFoundException('Shipment not found');
        }

        if (shipment.status === ShipmentStatus.DELIVERED) {
            throw new BadRequestException('Delivered shipments cannot be cancelled');
        }

        if (shipment.status === ShipmentStatus.CANCELLED) {
            throw new BadRequestException('Shipment is already cancelled');
        }

        shipment.status = ShipmentStatus.CANCELLED;
        const updatedShipment = await this.shipmentsRepository.save(shipment);

        const event = this.shipmentEventsRepository.create({
            shipmentId: shipment.id,
            userId,
            status: ShipmentStatus.CANCELLED,
            location: 'System',
            notes: 'Shipment cancelled',
        });

        await this.shipmentEventsRepository.save(event);

        return this.findOne(updatedShipment.id);
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
