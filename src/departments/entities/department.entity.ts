import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('departments')
export class Department {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    name!: string;

    // TODO: managerId
    // TODO: directionId

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
