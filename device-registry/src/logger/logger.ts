import {sendMessage} from "../services/message-sender";

function createLogProxy(originalFn: (...args: any[]) => void, type: string) {
    return async (...args: any[]) => {
        const message = args.map(arg => (typeof arg === 'string' ? arg : JSON.stringify(arg))).join(' ');

        sendMessage('device-registry-logs', { type, message, timestamp: new Date().toISOString() })
            .catch(err => originalFn('Log queue error:', err));
        originalFn.apply(console, args);
    };
}

console.log = createLogProxy(console.log, 'info');
console.error = createLogProxy(console.error, 'error');
console.warn = createLogProxy(console.warn, 'warn');

export {};