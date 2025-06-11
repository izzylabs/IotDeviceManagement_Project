import express from 'express';
import {listenCommandExecutions, listenExecutionRetry} from "./services/message-consumer";
import {CommandExecutorDataSource} from "./data-source";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

CommandExecutorDataSource.initialize()
    .then(() => {
        console.log('Database connection established');
        listenCommandExecutions();
        listenExecutionRetry();

        app.listen(PORT, () => {
            console.log(`Command Executor running on port ${PORT}`);
        });
    })
    .catch(err => console.error('DB Connection error', err));
