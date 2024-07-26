import { NextFunction, Request, Response } from 'express';
import { ProductEvent } from './event-model';
import { FallbackAPIProducer } from '../pubsub/producer/fallback-api-producer';

export default class EventController {
  public static async getEvents(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { productIds } = req.query;

      const productEvents = await ProductEvent.find(
        { productId: { $in: productIds } },
        '-_id -__v',
        { lean: true },
      ).sort({ createdAt: -1 }); // Action: Sorting based on event timestamp in desc order

      res.status(200).send(productEvents);
    } catch (error) {
      next(error);
    }
  }

  public static async pushEvents(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { events } = req.body;

      console.log(events);

      // Action: Pushing to PRODUCT EVENT TOPIC, this is a fall back API for on-premise system
      const fallbackAPIProducer = new FallbackAPIProducer();
      await fallbackAPIProducer.run(events);

      res.status(201).send('Events pushed to the queue successfully');
    } catch (error) {
      next(error);
    }
  }
}
