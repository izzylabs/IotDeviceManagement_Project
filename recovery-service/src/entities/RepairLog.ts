import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class RepairLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  device: string;

  @Column()
  command: string;

  @Column()
  executionId: string;

  @Column()
  action: string;

  @Column()
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';

  @CreateDateColumn()
  triggeredAt: Date;
}
