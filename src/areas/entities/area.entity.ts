import { User } from "src/auth/entities/user.entity";
import { Department } from "src/departments/entities/department.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('areas')
export class Area {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @ManyToOne(
        () => User,
        user => user.coordinator
    )
    coordinator: User;

    @Column('uuid')
    coordinatorId?: string;

    @ManyToOne(
        () => User,
        user => user.leader
    )
    leader: User;

    @Column({
        type: 'uuid',
        nullable: true
    })
    leaderId?: string;

    @ManyToOne(
        () => Department,
        department => department.id
    )
    department: Department;

    @Column('uuid')
    departmentId: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: null
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    })
    updatedAt: Date;

    @DeleteDateColumn({
        type: 'timestamp',
        default: null
    })
    deletedAt: Date;
}
