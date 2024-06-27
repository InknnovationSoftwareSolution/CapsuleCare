import { Shedules } from 'src/shedules/shedules.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';

@Entity({name: 'notification'})
export class Notifications{

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Shedules, shedules => shedules.notifications)
    @JoinColumn()
    schedeles: Shedules

    @Column()
    sent_at: string

    @Column()
    type: string

    @Column()
    message: string

    @Column()
    created_at: Date
}