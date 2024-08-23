import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Shedules } from '../shedules/shedules.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'notifications' })
export class Notifications {

    @ApiProperty({ description: 'ID unico de la notificacion' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'ID unico de la alarma de su notificacion', required: true })
    @ManyToOne(() => Shedules, (shedules) => shedules.notifications)
    @JoinColumn({ name: 'schedule_id' })
    schedule: Shedules;

    @ApiProperty({ description: 'Fecha de la notificacion', required: true })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    sentAt: Date;

    @ApiProperty({ description: 'El tipo de medicamento', required: true })
    @Column()
    type: string;

    @ApiProperty({ description: 'Instruccion del medicamento', required: true })
    @Column()
    message: string;

    @ApiProperty({ description: 'Cuando se crea la notificacion' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}