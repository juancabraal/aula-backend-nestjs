import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
} from 'typeorm';

@Entity({
    name: 'aula_concluida',
})
export class AulaConcluida {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'aula_id',
    })
    aulaId: number;

    @Column()
    usuario: string;

    @Column()
    resposta: number = null;

    @Column()
    correta: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @BeforeInsert()
    fillDateFiels() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    @BeforeUpdate()
    updateDateFiels() {
        this.updatedAt = new Date();
    }
}
