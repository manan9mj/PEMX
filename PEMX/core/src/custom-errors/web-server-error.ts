import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';

export class WebServerError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}



export class ErrorHandler {
  public static handler(
    err: WebServerError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    const logger = Logger.getInstance();

    logger.error(`WEB_SERVER_ERROR: ${err.message}`, {
      'error.description': err.message,
      'error.stack': err.stack,
    });

    res.status(err.status || 500).send({ error: err.message });
  }
}
