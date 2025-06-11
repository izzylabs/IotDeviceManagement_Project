import { Entity } from "typeorm/decorator/entity/Entity";
import {Column, CreateDateColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {DeviceCommand} from "./device-command";

@Entity()
export class Device {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    isActive: boolean;

    @Column({type: 'float', nullable: true})
    batteryLevel: number;

    @CreateDateColumn()
    timestamp: Date;

    @ManyToMany(() => DeviceCommand, command => command.devices)
    @JoinTable()
    commands: DeviceCommand[];
}