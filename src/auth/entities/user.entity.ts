import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ResetToken } from "./reset-token.entity";
import { Enterprise } from "src/enterprises/entities/enterprise.entity";
import { Direction } from "src/directions/entities/direction.entity";
import { Department } from "src/departments/entities/department.entity";
import { Area } from "src/areas/entities/area.entity";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text')
    password: string;

    @Column('text')
    fullName: string;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @Column('bool', {
        default: true
    })
    state: boolean;

    @ManyToOne(
        () => ResetToken, 
        resetToken => resetToken.user
    )
    resetToken: ResetToken;

    @OneToMany(
        () => Enterprise, 
        enterprise => enterprise.ceo
    )
    enterprises: Enterprise[];

    @OneToMany(
        () => Area,
        area => area.leader
    )
    leader: Area[];

    @OneToMany(
        () => Area,
        area => area.coordinator
    )
    coordinator: Area[];

    @OneToMany(
        () => Direction,
        direction => direction.director
    )
    directions: Direction[];

    @OneToMany(
        () => Department,
        department => department.manager
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
        this.email = this.email.toLowerCase().trim();
        this.fullName = this.capitalize(this.fullName).trim();
    }

    private capitalize(str: string) {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }
}
