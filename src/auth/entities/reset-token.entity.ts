import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('reset_tokens')
export class ResetToken {
        
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    token: string;

    @ManyToOne(
        () => User, 
        user => user.resetToken
    )
    user: User;

    @CreateDateColumn({
        type: 'timestamp', 
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;
}