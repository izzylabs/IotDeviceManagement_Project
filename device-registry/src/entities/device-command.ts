import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Device } from './device';

@Entity()
export class DeviceCommand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToMany(() => Device, (device) => device.commands)
  devices: Device[];
}
