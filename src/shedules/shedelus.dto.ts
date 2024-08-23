import {  IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class newShed{

    @ApiProperty({ description: 'Medicina de la alarma correspondiente', required: true })
    @IsNotEmpty({message:"No puede quedar vacío"})
    @IsInt({message:"El dato debe ser un número"})
    medicina: number

    @ApiProperty({ description: 'Id del usuario', required: true })
    @IsNotEmpty({message:"No puede quedar vacío"})
    @IsInt({message:"El dato debe ser un número"})
    user: number

    @ApiProperty({ description: 'El tiempo de la alarma', required: true })
    @IsNotEmpty({message:"No puede quedar vacío"})
    @IsInt({message:"El dato debe ser un número"})
    intervalo: number


    @ApiProperty({ description: 'La fecha en que termina', required: true })
    finish_time: Date
}

export class updatShed{

    @ApiProperty({ description: 'El tiempo de la alarma', required: false })
    @IsOptional()
    @IsNotEmpty({message:"No puede quedar vacío"})
    @IsInt({message:"El dato debe ser un número"})
    intervalo?: number
    
    @ApiProperty({ description: 'La fecha en que termina', required: false })
    finish_time?: Date
}