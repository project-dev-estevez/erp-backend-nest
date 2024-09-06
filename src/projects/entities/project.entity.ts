import { Customer } from "src/customers/entities/customer.entity";
import { Enterprise } from "src/enterprises/entities/enterprise.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('projects')
export class Project {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @ManyToOne(
        () => Customer, 
        customer => customer.id
    )
    customer: Customer;

    @Column('uuid')
    customerId: string;

    @ManyToOne(
        () => Enterprise,
        enterprise => enterprise.id
    )
    enterprise: Enterprise;

    @Column('uuid')
    enterpriseId: string;

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
