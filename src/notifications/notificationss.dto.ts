import { ApiProperty } from '@nestjs/swagger';

export class Updatnotif{
    @ApiProperty({ description: 'Nombre del usuario', required: false })
    shedule?: number

    @ApiProperty({ description: 'Nombre del usuario', required: false })
    sent?: Date

    @ApiProperty({ description: 'Nombre del usuario', required: false })
    type?: string

    @ApiProperty({ description: 'Nombre del usuario', required: false })
    message?: string
}