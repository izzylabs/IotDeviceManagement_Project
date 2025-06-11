import { RecoveryServiceDataSource } from '../data-source';
import { RepairLog } from '../entities/RepairLog';
import { v4 as uuidv4 } from 'uuid';
import { sendMessage } from './message-sender';

interface FailedExecutionProps {
  executionId: string;
  deviceId: string;
  commandId: string;
}

export const handleFailedExecution = async ({
  executionId,
  deviceId,
  commandId,
}: FailedExecutionProps) => {
  const repo = RecoveryServiceDataSource.getRepository(RepairLog);

  const log = repo.create({
    id: uuidv4(),
    executionId: executionId,
    device: deviceId,
    command: commandId,
    action: 'Retry',
    status: 'PENDING',
  });
  await repo.save(log);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const success = Math.random() > 0.2;
  if (!success) {
    log.status = 'FAILED';
    await repo.save(log);
  } else {
    log.status = 'SUCCEEDED';
    await repo.save(log);
  }

  console.log(`Execution ${executionId} updated: ${log.status}`);
  await sendMessage('command-execution-retried', {
    executionId,
    status: log.status,
  });
};
