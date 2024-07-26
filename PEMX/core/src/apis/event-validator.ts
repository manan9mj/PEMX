import { body, query } from 'express-validator';
import ValidationErrorHandler from './validation-error-handler';

export const getEventsValidator = [
  query('productIds')
    .exists()
    .withMessage('Product Id is missing in query')
    .custom((value) => {
      if (value.split(',').length > 200) {
        throw new Error(
          'Product ids out of the limit, must be between 1 and 200 product ids at a time and should be comma seprated',
        );
      }
      return true;
    })
    .customSanitizer((value) =>
      value.split(',').map((val: string) => val.trim()),
    ),
  ValidationErrorHandler,
];

export const pushEventsValidator = [
  body('events')
    .exists()
    .withMessage('Zero events entered')
    .isArray({ min: 1, max: 200 })
    .withMessage(
      'Events out of the limit, between 1 and 200 events can be pushed at a time',
    ),
  body('events.*.eventId').isUUID().withMessage('Event ID must be a valid UUID'),
  body('events.*.eventType').notEmpty().withMessage('Event type is required'),
  body('events.*.productId').notEmpty().withMessage('Product ID is required'),
  body('events.*.region').notEmpty().withMessage('Region is required'),
  body('events.*.createdAt')
    .isISO8601()
    .withMessage('Created at must be a valid ISO 8601 date'),
  ValidationErrorHandler,
];
