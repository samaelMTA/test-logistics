import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment } from '../shipments/entities/shipment.entity/shipment.entity';

@Injectable()
export class TrackingService {
    constructor(
        @InjectRepository(Shipment)
        private readonly shipmentsRepository: Repository<Shipment>,
    ) { }

    async findByTrackingCode(trackingCode: string) {
        const shipment = await this.shipmentsRepository.findOne({
            where: { trackingCode },
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

        return {
            trackingCode: shipment.trackingCode,
            status: shipment.status,
            deliveredAt: shipment.deliveredAt,
            recipientName: shipment.recipientName,
            originAddress: shipment.originAddress,
            destinationAddress: shipment.destinationAddress,
            createdAt: shipment.createdAt,
            events: shipment.events,
        };
    }
}
