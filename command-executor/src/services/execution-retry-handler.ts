import { CommandExecutorDataSource } from '../data-source';
import { CommandExecution } from '../entities/command-execution';
import { sendMessage } from './message-sender';

interface CommandExecutionProps {
  executionId: string;
  status: 'SUCCESS' | 'FAILED';
}

export const handleExecutionRetry = async ({
  executionId,
  status,
}: CommandExecutionProps) => {
  const repo = CommandExecutorDataSource.getRepository(CommandExecution);

  let exec = await repo.findOne({ where: { id: executionId } });
  if (!exec) {
    console.warn(`Execution ${executionId} not found`);
    return;
  }

  exec.status = status;
  exec.finishedAt = new Date();
  await repo.save(exec);

  await sendMessage('command-execution-finished', {
    executionId,
    status: exec.status,
    finishedAt: exec.finishedAt,
  });

  console.log(`Execution ${executionId} updated: ${exec.status}`);
};
