import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ResetToken } from "./reset-token.entity";

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

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @ManyToOne(
        () => ResetToken, 
        resetToken => resetToken.user
    )
    resetToken: ResetToken;

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
