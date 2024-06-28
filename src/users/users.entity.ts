import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Shedules } from '../shedules/shedules.entity';
import { Medicina } from 'src/medications/medications.entity';

@Entity({ name: 'users' })
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;  // Renombrado para ser más descriptivo

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;  // Renombrado para seguir la convención camelCase

    @OneToMany(() => Shedules, shedules => shedules.users)
    shedules: Shedules[];

    @OneToMany(() => Medicina, medicina => medicina.user)
    medicina: Medicina[];
}