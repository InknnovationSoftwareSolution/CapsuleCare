import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Shedules } from '../shedules/shedules.entity';
import { Medicina } from '../medications/medications.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class Users {

    @ApiProperty({ description: 'ID unico del usuario' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Nombre del usuario', required: true })
    @Column()
    userName: string;

    @ApiProperty({ description: 'Correo del usuario', required: true })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ description: 'Clave del usuario', required: true })
    @Column()
    password: string;

    @ApiProperty({ description: 'Fecha de registro' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ApiProperty({ description: 'Lista de alarmas del usuario' })
    @OneToMany(() => Shedules, shedules => shedules.users)
    @JoinColumn()
    shedules: Shedules[];

    @ApiProperty({ description: 'Lista de medicinas del usuario' })
    @OneToMany(() => Medicina, medicina => medicina.user)
    medicina: Medicina[];
}