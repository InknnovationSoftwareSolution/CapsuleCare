import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Medicina } from '../medications/medications.entity';
import { Users } from '../users/users.entity';
import { Notifications } from 'src/notifications/notifications.entity';

@Entity({ name: 'shedules' })
export class Shedules {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Users, users => users.shedules)
    @JoinColumn()
    users: Users

    @ManyToOne(() => Medicina, medicina => medicina.schedules)
    @JoinColumn()
    medicina: Medicina

    @Column({type: 'datetime'})
    start_time: Date

    @Column({type: 'datetime'})
    interval_hours: number

    @Column({type: 'datetime'})
    next_dose_time:Date

    @OneToMany(() => Notifications, notifications => notifications.schedeles)
    @JoinColumn()
    notifications: Notifications[]
    finish_dose_time: Date;
}