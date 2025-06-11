import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Device } from './device';
import { DeviceCommand } from './device-command';

@Entity()
export class CommandExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Device, { onDelete: 'CASCADE' })
  device: Device;

  @ManyToOne(() => DeviceCommand, { eager: true, onDelete: 'CASCADE' })
  command: DeviceCommand;

  @Column({ type: 'text', default: 'PENDING' })
  status: 'PENDING' | 'SUCCESS' | 'FAILED';

  @CreateDateColumn()
  startedAt: Date;

  @Column({ type: 'date', nullable: true, default: null })
  finishedAt?: Date;
}
