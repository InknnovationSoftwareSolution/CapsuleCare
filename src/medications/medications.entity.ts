import { PrimaryGeneratedColumn, Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Shedules } from "../shedules/shedules.entity";
import { ApiProperty } from '@nestjs/swagger';
import { Users } from "../users/users.entity";

@Entity({ name: 'medicina' })
export class Medicina {

    @ApiProperty({ description: 'ID unico de la medicina' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Nombre del medicamento', required: true })
    @Column()
    name: string;

    @ApiProperty({ description: 'Dosis a tomar', required: true })
    @Column()
    quantity: number

    @ApiProperty({ description: 'ID unico del usuario para la medicina', required: true })
    @ManyToOne(() => Users, users => users.medicina)
    @JoinColumn({ name: 'user' })
    user: Users;

    @ApiProperty({ description: 'Lista de alarmas de la medicina' })
    @OneToMany(() => Shedules, shedules => shedules.medicina)
    schedules: Shedules[];
}