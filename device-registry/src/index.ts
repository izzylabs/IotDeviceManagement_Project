import './logger/logger';
import express from 'express';
import deviceRoutes from './routes/devices';
import healthCheckRoutes from './routes/health';
import executionRoutes from './routes/executions';
import {IoTDeviceManagementDataSource} from "./data-source";
import {listenCommandExecutionSucceeded} from "./services/message-consumer";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

IoTDeviceManagementDataSource.initialize()
    .then(() => {
        console.log('Database connection established');

        app.use('/devices', deviceRoutes);
        app.use('/executions', executionRoutes);
        app.use('/health-check', healthCheckRoutes);

        listenCommandExecutionSucceeded();

        app.listen(PORT, () => {
            console.log(`Device Registry running on port ${PORT}`);
        });
    })
    .catch(err => console.error('DB Connection error', err));

export default app;
