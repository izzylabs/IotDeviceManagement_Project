import { CommandExecutorDataSource } from '../data-source';
import { CommandExecution } from '../entities/command-execution';
import { sendMessage } from './message-sender';

interface CommandExecutionProps {
  executionId: string;
  deviceId: string;
  commandId: string;
  startedAt: Date;
}

export const handleExecution = async ({
  executionId,
  deviceId,
  commandId,
  startedAt,
}: CommandExecutionProps) => {
  const repo = CommandExecutorDataSource.getRepository(CommandExecution);

  let exec = await repo.findOne({ where: { id: executionId } });

  if (!exec) {
    exec = await repo.create({
      id: executionId,
      device: deviceId,
      command: commandId,
      status: 'PENDING',
      startedAt: startedAt,
    });
    await repo.save(exec);
    console.log(`Execution ${executionId} created`);
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const success = Math.random() > 0.4;

  exec.status = success ? 'SUCCESS' : 'FAILED';
  exec.finishedAt = new Date();

  await repo.save(exec);

  if (exec.status === 'SUCCESS') {
    await sendMessage('command-execution-finished', {
      executionId,
      status: exec.status,
      finishedAt: exec.finishedAt,
    });
  }

  if (exec.status === 'FAILED') {
    await sendMessage('command-execution-failed', {
      executionId,
      deviceId: exec.device,
      commandId: exec.command,
    });
  }

  console.log(`Execution ${executionId} updated: ${exec.status}`);
};
