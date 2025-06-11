import {ServiceBusClient} from '@azure/service-bus';
import {handleExecution} from "./execution-handler";
import {handleExecutionRetry} from "./execution-retry-handler";

const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;

export const listenCommandExecutions = () => {
    const sbClient = new ServiceBusClient(connectionString!);
    const receiver = sbClient.createReceiver('command-executed');

    receiver.subscribe({
       processMessage: async (msg) => {
           const { executionId, deviceId, commandId, startedAt } = msg.body;
           await handleExecution({ executionId, deviceId, commandId, startedAt });
       },
       processError: async (err) => {
           console.error('Error receiving message:', err);
       }
    });

    console.log(`Listening for device command execution on Azure Service Bus...`);
};

export const listenExecutionRetry = () => {
    const sbClient = new ServiceBusClient(connectionString!);
    const receiver = sbClient.createReceiver('command-execution-retried');

    receiver.subscribe({
        processMessage: async (msg) => {
            const { executionId, status } = msg.body;
            await handleExecutionRetry({ executionId, status });
        },
        processError: async (err) => {
            console.error('Error receiving message:', err);
        }
    });

    console.log(`Listening for device command execution on Azure Service Bus...`);
};