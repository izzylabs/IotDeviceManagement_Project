import {IoTDeviceManagementDataSource} from "../data-source";
import {CommandExecution} from "../entities/command-execution";

interface CommandExecutionProps {
    executionId: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    finishedAt: Date;
}

export const handleExecution = async ({executionId, status, finishedAt}: CommandExecutionProps) => {
    const repo = IoTDeviceManagementDataSource.getRepository(CommandExecution);

    let exec = await repo.findOne({where: {id: executionId}});
    if (!exec) {
        console.warn(`Execution ${executionId} not found`);
        return;
    }

    exec.status = status;
    exec.finishedAt = finishedAt;
    await repo.save(exec);
    console.log(`Execution ${executionId} updated: ${exec.status}`);
};