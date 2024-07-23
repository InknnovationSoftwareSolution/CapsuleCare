import { PrimaryGeneratedColumn, Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Shedules } from "../shedules/shedules.entity";
import { Users } from "../users/users.entity";

@Entity({ name: 'medicina' })
export class Medicina {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    dosis: number

    @ManyToOne(() => Users, users => users.medicina)
    @JoinColumn({ name: 'user' })
    user: Users;

    @OneToMany(() => Shedules, shedules => shedules.medicina)
    schedules: Shedules[];
}