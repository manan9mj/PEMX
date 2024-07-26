import winston from 'winston';

/**
 * Winston Log Levels - can add more custom ones, 
 */
const logConfig = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    info: 3,
  },
  colors: {
    error: 'red',
    debug: 'yellow',
    warn: 'orange',
    info: 'green',
  },
};
const colorizer = winston.format.colorize();

/**
 * Utility for implementing logging using Winston logger
 * Implemented as a singleton class
 */
export default class Logger {
  private static instance: Logger;

  public logger: any;

  // Singleton pattern to instantiate logger
  private constructor() {
    this.initLogger();
  }

  // Returns existing logger instance or new instance
  public static getInstance() {
    if (Logger.instance) {
      return this.instance;
    }
    this.instance = new Logger();
    return this.instance;
  }

  public debug(msg: any, meta: any) {
    return this.logger.debug(msg, { ...meta, log_level: 'DEBUG' });
  }

  public info(msg: any, meta: any = {}) {
    return this.logger.info(msg, { ...meta, log_level: 'INFO' });
  }

  public warn(msg: any, meta: any) {
    return this.logger.warn(msg, { ...meta, log_level: 'WARN' });
  }

  public error(msg: any, meta: any) {
    return this.logger.error(msg, { ...meta, log_level: 'ERROR' });
  }

  public log(level: any, msg: any, meta: any) {
    return this.logger.log(level, msg, { ...meta, log_level: 'LOG' });
  }

  private initLogger() {
    winston.addColors(logConfig.colors);
    this.logger = winston.createLogger({
      levels: logConfig.levels,
      level: process.env.LOGGER_LEVEL || 'info',
      defaultMeta: {
        timestamp: new Date().toISOString(),
        trace_id: null,
        span_id: null,
        resource: {
          'platform': 'PEMX',
          'interface_id': process.env.INTERFACE_ID,
          'interface_name': process.env.INTERFACE_NAME,
        },
      },
    });

    if (process.env.NODE_ENV === 'development') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:MM:ss',
            }),
            winston.format.printf(
              (msg: any) => colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: `) + JSON.stringify(msg.message, null, 2),
            ),
          ),
        }),
      );
    } else {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:MM:ss',
            }),
            winston.format.json(),
          ),
        }),
      );
    }

    /**
     * Winston transports extendable to other logging services - LaaS, Cloud, Database, File System, etc. 
     */
  }
}
