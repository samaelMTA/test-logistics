import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class AssignVehiclesDto {
    @ApiProperty({
        example: [
            '550e8400-e29b-41d4-a716-446655440000',
            '550e8400-e29b-41d4-a716-446655440001',
        ],
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    shipmentIds: string[];

    @ApiProperty({ example: 100 })
    @IsNumber()
    @IsPositive()
    vehicleCapacity: number;
}