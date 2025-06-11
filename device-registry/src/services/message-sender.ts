import {ServiceBusClient, ServiceBusMessage} from '@azure/service-bus';

const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;

export const sendMessage = async (queueName: string, message: any) => {
    const sbClient = new ServiceBusClient(connectionString!);
    const sender = sbClient.createSender(queueName);
    const serviceBusMessage: ServiceBusMessage = {
        body: message,
    }

    await sender.sendMessages(serviceBusMessage);
    await sender.close();
}
