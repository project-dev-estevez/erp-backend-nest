import { Project } from "src/projects/entities/project.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('customers')
export class Customer {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    rfc: string;

    @Column('text')
    email: string;

    @Column('text')
    phoneNumber: string;

    @OneToMany(
        () => Project,
        project => project.id
    )
    project: Project;

    @CreateDateColumn({
        type:'timestamp',
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
