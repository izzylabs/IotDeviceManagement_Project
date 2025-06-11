import './logger/logger';
import express from 'express';
import { listenCommandExecutionFailed } from './services/message-consumer';
import { RecoveryServiceDataSource } from './data-source';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

RecoveryServiceDataSource.initialize()
  .then(() => {
    console.log('Database connection established');
    listenCommandExecutionFailed();

    app.listen(PORT, () => {
      console.log(`Recovery Service running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('DB Connection error', err));
