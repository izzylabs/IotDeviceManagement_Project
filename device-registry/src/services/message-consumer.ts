import {ServiceBusClient} from '@azure/service-bus';
import {handleExecution} from "./execution-handler";

const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
const queueName = 'command-execution-finished';

export const listenCommandExecutionSucceeded = () => {
    const sbClient = new ServiceBusClient(connectionString!);
    const receiver = sbClient.createReceiver(queueName);

    receiver.subscribe({
       processMessage: async (msg) => {
           const { executionId, status, finishedAt } = msg.body;
           await handleExecution({ executionId, status, finishedAt });
       },
       processError: async (err) => {
           console.error('Error receiving message:', err);
       }
    });

    console.log(`Listening for device command execution on Azure Service Bus...`);
};