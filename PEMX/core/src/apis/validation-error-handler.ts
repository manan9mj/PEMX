import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Logger from '../utils/logger';

export default function validationErrorHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const logger = Logger.getInstance();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(
      'VALIDATION_ERRORS: Validation Failed for web apis',
      errors.array(),
    );
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
}
