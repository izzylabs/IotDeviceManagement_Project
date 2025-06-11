import {DataSource} from "typeorm";
import {RepairLog} from "./entities/RepairLog";

export const RecoveryServiceDataSource = new DataSource({
    type: 'mssql',
    host: process.env.DB_SERVER,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [RepairLog],
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
});