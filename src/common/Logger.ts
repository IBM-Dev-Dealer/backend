import winston from 'winston';

export enum LoggerTypes {
    info = "info",
    warn = "warn",
    error = "error"
}

export class Logger {
    public log(message: string, level: string) {
        const logger = winston.createLogger({
            transports: [
                new winston.transports.Console()
            ]
        });
        logger.log({
            message: message,
            level: level
        });
    }
}

