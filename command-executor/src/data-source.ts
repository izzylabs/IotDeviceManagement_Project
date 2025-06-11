import {DataSource} from "typeorm";
import {CommandExecution} from "./entities/command-execution";

export const CommandExecutorDataSource = new DataSource({
    type: 'mssql',
    host: process.env.DB_SERVER,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [CommandExecution],
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
});