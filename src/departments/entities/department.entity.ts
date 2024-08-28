import { Area } from "src/areas/entities/area.entity";
import { User } from "src/auth/entities/user.entity";
import { Direction } from "src/directions/entities/direction.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('departments')
export class Department {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    name!: string;

    @ManyToOne(
        () => User,
        user => user.id
    )
    manager?: User;

    @ManyToOne(
        () => Direction,
        direction => direction.id
    )
    direction!: Direction;

    @OneToMany(
        () => Area,
        area => area.id
    )
    area!: Area;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt!: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    updatedAt!: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        default: null
    })
    deletedAt?: Date;

}
