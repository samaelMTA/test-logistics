import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { Shipment } from '../shipments/entities/shipment.entity/shipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment])],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule { }
