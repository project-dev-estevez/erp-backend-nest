import { User } from "src/auth/entities/user.entity";
import { Direction } from "src/directions/entities/direction.entity";
import { Project } from "src/projects/entities/project.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('enterprises')
export class Enterprise {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    address: string;

    @Column('text')
    phoneNumber: string;

    @Column('text')
    rfc: string;

    @ManyToOne(
        () => User, 
        user => user.enterprises
    )
    ceo: User;

    @OneToMany(
        () => Project,
        project => project.id
    )
    project: Project;


    @Column('uuid')
    ceoId?: string;

    @OneToMany(
        () => Direction,
        direction => direction.id
    )
    directions: Direction[];

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
