import express, {Request, Response} from 'express';
import {z} from "zod";
import {IoTDeviceManagementDataSource} from "../data-source";
import {Device} from "../entities/device";
import {v4 as uuidv4} from "uuid";
import {DeviceCommand} from "../entities/device-command";
import {delCache, getCache, setCache} from "../services/cache";

const router = express.Router();
const DEVICE_CACHE_KEY = 'devices:all';

export const createDeviceSchema = z.object({
    name: z.string(),
    isActive: z.boolean(),
    batteryLevel: z.number().optional(),
    commands: z.array(z.string()).optional(),
});

const deviceRepo = IoTDeviceManagementDataSource.getRepository(Device);

// @ts-ignore
router.post('/', async (req: Request, res: Response) => {
    const result = createDeviceSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
    }

    const commandRepo = IoTDeviceManagementDataSource.getRepository(DeviceCommand);

    let commandEntities: DeviceCommand[] = [];
    if (result.data.commands?.length) {
        for (const name of result.data.commands) {
            let command = await commandRepo.findOne({ where: { name } });
            if (!command) {
                command = commandRepo.create({ name });
                await commandRepo.save(command);
            }
            commandEntities.push(command);
        }
    }
    console.log(`Commands ${commandEntities.map(c => c.name).join(', ')} are added.`);

    const device = deviceRepo.create({
        id: uuidv4(),
        name: result.data.name,
        isActive: result.data.isActive,
        batteryLevel: result.data.batteryLevel,
        commands: commandEntities,
    });

    delCache(DEVICE_CACHE_KEY);
    await deviceRepo.save(device);
    console.log(`Device ${device.id} registered successfully`);
    return res.status(201).json(device);
});

// @ts-ignore
router.get('/', async (_: Request, res: Response) => {
    const cached = getCache(DEVICE_CACHE_KEY);
    if (cached) {
        return res.json(cached);
    }

    const devices = await deviceRepo.find({ relations: ['commands']});
    setCache(DEVICE_CACHE_KEY, devices);

    res.json(devices);
});

// @ts-ignore
router.get('/:id', async (req: Request, res: Response) => {
    if (!req.params.id) {
        return res.status(400).json({error: 'Missing device id'});
    }

    const device = await deviceRepo.findOne({
        where: {
            id: req.params.id
        },
        relations: ['commands'],
    });
    if (!device) {
        return res.status(404).json({error: 'Device not found'});
    }

    res.json(device);
});



const updateDeviceSchema = z.object({
    name: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
    batteryLevel: z.number().nullable().optional(),
    commands: z.array(z.string()).optional(),
});

// @ts-ignore
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Missing device ID' });

    const parsed = updateDeviceSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.format() });
    }

    const device = await deviceRepo.findOne({
        where: { id },
        relations: ['commands'],
    });

    if (!device) {
        return res.status(404).json({ error: 'Device not found' });
    }

    Object.assign(device, parsed.data);

    if (parsed.data.commands) {
        const commandRepo = IoTDeviceManagementDataSource.getRepository(DeviceCommand);

        const newCommandEntities: DeviceCommand[] = [];
        for (const name of parsed.data.commands) {
            let command = await commandRepo.findOne({ where: { name } });
            if (!command) {
                command = commandRepo.create({ name });
                await commandRepo.save(command);
            }
            newCommandEntities.push(command);
        }

        device.commands = newCommandEntities;
    }

    const updatedDevice = await deviceRepo.save(device);
    delCache(DEVICE_CACHE_KEY);
    return res.json(updatedDevice);
});

// @ts-ignore
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Missing device ID' });
    }

    const device = await deviceRepo.findOne({ where: { id } });

    if (!device) {
        return res.status(404).json({ error: 'Device not found' });
    }

    await deviceRepo.remove(device);

    console.log(`Device ${id} deleted`);
    delCache(DEVICE_CACHE_KEY);
    return res.json({ message: 'Device deleted successfully' });
});

export default router;