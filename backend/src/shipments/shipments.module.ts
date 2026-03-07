import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';
import { Shipment } from './entities/shipment.entity/shipment.entity';
import { ShipmentEvent } from './entities/shipment-event.entity/shipment-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment, ShipmentEvent])],
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
  exports: [ShipmentsService],
})
export class ShipmentsModule {}
