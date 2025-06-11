import {ServiceBusClient} from '@azure/service-bus';
import {handleFailedExecution} from "./execution-fail-handler";

const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
const queueName = 'command-execution-failed';

export const listenCommandExecutionFailed = () => {
    const sbClient = new ServiceBusClient(connectionString!);
    const receiver = sbClient.createReceiver(queueName);

    receiver.subscribe({
       processMessage: async (msg) => {
           const { executionId, deviceId, commandId } = msg.body;
           await handleFailedExecution({ executionId, deviceId, commandId });
       },
       processError: async (err) => {
           console.error('Error receiving message:', err);
       }
    });

    console.log(`Listening for device command execution on Azure Service Bus...`);
};