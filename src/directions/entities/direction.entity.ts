import { User } from "src/auth/entities/user.entity";
import { Department } from "src/departments/entities/department.entity";
import { Enterprise } from "src/enterprises/entities/enterprise.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('directions')
export class Direction {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('bool', {
        default: false
    })
    isGeneralDirection: boolean;

    @Column('bool', {
        default: true
    })
    state: boolean;

    @ManyToOne(
        () => Enterprise,
        enterprise => enterprise.id
    )
    enterprise: Enterprise;

    @ManyToOne(
        () => User,
        user => user.id
    )
    director: User;

    @ManyToOne(
        () => Direction,
        direction => direction.id
    )
    department: Department[];

    @CreateDateColumn({
        type: 'timestamp', 
        default: () => 'CURRENT_TIMESTAMP'
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
    deletedAt?: Date;

    @BeforeInsert()
    @BeforeUpdate()
    transformFields() {
        this.name = this.capitalize(this.name).trim();
    }

    private capitalize(str: string) {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

}
