import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class CommandExecution {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    device: string;

    @Column({ type: 'uuid' })
    command: string;

    @Column({ type: 'text', default: 'PENDING' })
    status: 'PENDING' | 'SUCCESS' | 'FAILED';

    @CreateDateColumn()
    startedAt: Date;

    @Column({ type: "date", nullable: true, default: null })
    finishedAt?: Date;
}