import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Shedules } from '../shedules/shedules.entity';
import { Medicina } from 'src/medications/medications.entity';

@Entity({ name: 'users' })
export class Users{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userName: string

    @Column({unique: true})
    email: string

    @Column()
    passw: string

    @Column()
    create_at: Date

    @OneToMany(() => Shedules, shedelus => shedelus.users)
    @JoinColumn()
    shedules: Shedules[]
   
    @OneToMany(() => Medicina, medicina => medicina.user)
    @JoinColumn()
    medicina: Medicina[]

}