import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


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
        this.name = this.capitalize(this.name).trim();
    }

    private capitalize(str: string) {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

}
