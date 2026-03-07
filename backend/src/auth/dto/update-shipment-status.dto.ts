import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ShipmentStatus } from '../../common/enums/shipment-status.enum';

export class UpdateShipmentStatusDto {
    @ApiProperty({ enum: ShipmentStatus, example: ShipmentStatus.IN_TRANSIT })
    @IsEnum(ShipmentStatus)
    status: ShipmentStatus;

    @ApiProperty({ example: 'Madrid Hub' })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiPropertyOptional({ example: 'Shipment loaded into truck' })
    @IsOptional()
    @IsString()
    notes?: string;
}