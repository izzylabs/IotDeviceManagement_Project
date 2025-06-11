import express, {Request, Response} from "express";
import {z} from "zod";
import {CommandExecution} from "../entities/command-execution";
import {IoTDeviceManagementDataSource} from "../data-source";
import {Device} from "../entities/device";
import {DeviceCommand} from "../entities/device-command";
import {sendMessage} from "../services/message-sender";

const router = express.Router();

export const createExecutionSchema = z.object({
    deviceId: z.string().uuid(),
    commandId: z.string().uuid(),
});

const execRepo = IoTDeviceManagementDataSource.getRepository(CommandExecution);

// @ts-ignore
router.post('/', async (req: Request, res: Response) => {
    const deviceRepo = IoTDeviceManagementDataSource.getRepository(Device);
    const commandRepo = IoTDeviceManagementDataSource.getRepository(DeviceCommand);

    const parsed = createExecutionSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.format() });
    }

    const { deviceId, commandId } = parsed.data;

    const device = await deviceRepo.findOne({
        where: { id: deviceId },
        relations: ['commands'],
    });
    if (!device) {
        return res.status(404).json({ error: 'Device not found' });
    }

    const command = await commandRepo.findOne({
        where: { id: commandId },
    });
    if (!command) {
        return res.status(404).json({ error: 'Command not found' });
    }

    const isLinked = device.commands.some(cmd => cmd.id === commandId);
    if (!isLinked) {
        return res.status(400).json({ error: 'Command not assigned to device' });
    }

    const execution = execRepo.create({
        device,
        command,
        status: 'PENDING',
    });

    await execRepo.save(execution);
    await sendMessage('command-executed', {
        deviceId,
        commandId,
        executionId: execution.id,
        startedAt: execution.startedAt,
    });


    return res.status(201).json({
        message: 'Command execution created',
        executionId: execution.id,
    });
});

// @ts-ignore
router.get('/device/:deviceId', async (req: Request, res: Response) => {
    const { id: deviceId } = req.params;

    const executions = await execRepo.find({
        where: { device: { id: deviceId } },
        relations: ['device', 'command'],
        order: { startedAt: 'DESC' },
    });

    res.json(executions);
});

// @ts-ignore
router.get('/command/:commandId', async (req: Request, res: Response) => {
    const { id: commandId } = req.params;

    const executions = await execRepo.find({
        where: { command: { id: commandId } },
        relations: ['device', 'command'],
        order: { startedAt: 'DESC' },
    });

    res.json(executions);
});

// @ts-ignore
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const execution = await execRepo.findOne({
        where: { id },
        relations: ['device', 'command'],
    });

    if (!execution) {
        return res.status(404).json({ error: 'Execution not found' });
    }

    res.json(execution);
});

export default router;