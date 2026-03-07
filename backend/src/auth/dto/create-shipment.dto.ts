import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateShipmentDto {
    @ApiProperty({ example: 'Calle A 123, Madrid' })
    @IsString()
    @IsNotEmpty()
    originAddress: string;

    @ApiProperty({ example: 'Avenida B 456, Barcelona' })
    @IsString()
    @IsNotEmpty()
    destinationAddress: string;

    @ApiProperty({ example: 'Samael Velasquez' })
    @IsString()
    @IsNotEmpty()
    recipientName: string;

    @ApiPropertyOptional({ example: '+34600800900' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ example: 12.5 })
    @IsNumber()
    @IsPositive()
    weight: number;
}