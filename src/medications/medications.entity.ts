import { Shedules } from "src/shedules/shedules.entity";
import { Users } from "src/users/users.entity";
import { PrimaryGeneratedColumn, Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";


@Entity({ name: 'medicina' })
export class Medicina {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    quantity: number

    @ManyToOne(() => Users, users => users.medicina)
    @JoinColumn({ name: 'user' })
    user: Users

    @OneToMany(() => Shedules, Shedules => Shedules.medicina)
    @JoinColumn()
    schedules:Shedules[]
}



