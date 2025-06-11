import { DataSource } from 'typeorm';
import { Device } from './entities/device';
import { DeviceCommand } from './entities/device-command';
import { CommandExecution } from './entities/command-execution';

export const IoTDeviceManagementDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_SERVER,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [Device, DeviceCommand, CommandExecution],
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
});
