import { Shedules } from "src/shedules/shedules.entity";
import { Users } from "src/users/users.entity";
import { PrimaryGeneratedColumn, Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";

@Entity({ name: 'medicina' })
export class Medicina {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Users, users => users.medicina)
    @JoinColumn({ name: 'user' })  // Especifica el nombre de la columna de unión
    user: Users;

    @OneToMany(() => Shedules, shedules => shedules.medicina)
    schedules: Shedules[];
}