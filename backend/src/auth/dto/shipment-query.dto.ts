import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import { ShipmentStatus } from '../../common/enums/shipment-status.enum';

export class ShipmentQueryDto {
    @ApiPropertyOptional({ example: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    page?: number = 1;

    @ApiPropertyOptional({ example: 10, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsPositive()
    limit?: number = 10;

    @ApiPropertyOptional({ enum: ShipmentStatus })
    @IsOptional()
    @IsEnum(ShipmentStatus)
    status?: ShipmentStatus;
}