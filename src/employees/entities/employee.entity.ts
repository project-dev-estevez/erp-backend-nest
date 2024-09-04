import { Area } from "src/areas/entities/area.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('employees')
export class Employee {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    position: string;

    @ManyToOne(
        () => Area, 
        area => area.id
    )
    area: Area;

    @Column('uuid')
    areaId?: string;

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
