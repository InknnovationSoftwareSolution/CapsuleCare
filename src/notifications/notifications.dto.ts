import { IsString, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class newNotificacion{

    @ApiProperty({ description: 'Notificacion de la alarma por id', required: true })
    @IsNotEmpty({message:"No puede quedar vacío"})
    @IsInt({message:"El dato debe ser un número"})
    schedule: number

    @ApiProperty({ description: 'La fecha', required: true })
    sent: Date

    @ApiProperty({ description: 'El tipo de medicamento', required: true })
    type: string

    @ApiProperty({ description: 'Mensaje de la notificacion', required: true })
    message: string
}