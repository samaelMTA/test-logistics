import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './../auth/dto/create-shipment.dto';
import { ShipmentQueryDto } from './../auth/dto/shipment-query.dto';
import { UpdateShipmentStatusDto } from './../auth/dto/update-shipment-status.dto';
import { AssignVehiclesDto } from './../auth/dto/assign-vehicles.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Shipments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('shipments')
export class ShipmentsController {
    constructor(private readonly shipmentsService: ShipmentsService) { }

    @Post()
    create(@Body() createShipmentDto: CreateShipmentDto, @Req() req: any) {
        return this.shipmentsService.create(createShipmentDto, req.user.id);
    }

    @Post('assign-vehicles')
    assignVehicles(@Body() assignVehiclesDto: AssignVehiclesDto) {
        return this.shipmentsService.assignVehicles(assignVehiclesDto);
    }

    @Get()
    findAll(@Query() queryDto: ShipmentQueryDto) {
        return this.shipmentsService.findAll(queryDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.shipmentsService.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body() updateShipmentStatusDto: UpdateShipmentStatusDto,
        @Req() req: any,
    ) {
        return this.shipmentsService.updateStatus(id, updateShipmentStatusDto, req.user.id);
    }

    @Delete(':id')
    cancel(@Param('id') id: string, @Req() req: any) {
        return this.shipmentsService.cancel(id, req.user.id);
    }
}
