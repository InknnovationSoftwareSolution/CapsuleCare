import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Medicina } from '../medications/medications.entity';
import { Users } from '../users/users.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Notifications } from '../notifications/notifications.entity';

@Entity({ name: 'shedules' })
export class Shedules {

    @ApiProperty({ description: 'ID unico de la alarma' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Id del usuario de su alarma', required: true })
    @ManyToOne(() => Users, users => users.shedules)
    @JoinColumn({ name: 'user' })
    users: Users;

    @ApiProperty({ description: 'Medicina que corresponde la alarma', required: true })
    @ManyToOne(() => Medicina, medicina => medicina.schedules)
    @JoinColumn({ name: 'medicina' })
    medicina: Medicina;

    @ApiProperty({ description: 'Cuando empieza la medicacion'})
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    start_time: Date;

    @ApiProperty({ description: 'Tiempo de aplicacion del medicamento', required: true })
    @Column()
    interval_hours: number;

    @ApiProperty({ description: 'Finaliza la medicacion', required: true })
    @Column()
    finish_dose_time: Date;

    @ApiProperty({ description: 'Lista de notificacion que tiene la medicina' })
    @OneToMany(() => Notifications, notifications => notifications.schedule)
    @JoinColumn()
    notifications: Notifications[];
}