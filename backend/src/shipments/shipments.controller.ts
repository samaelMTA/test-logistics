import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './../auth/dto/create-shipment.dto';
import { ShipmentQueryDto } from './../auth/dto/shipment-query.dto';
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

    @Get()
    findAll(@Query() queryDto: ShipmentQueryDto) {
        return this.shipmentsService.findAll(queryDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.shipmentsService.findOne(id);
    }
}
