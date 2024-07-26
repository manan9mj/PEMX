import { Router } from 'express';
import EventController from './event-controller';
import {
  getEventsValidator,
  pushEventsValidator,
} from './event-validator';

export default function routers() {
  const router = Router();

  router.get('/event', getEventsValidator, EventController.getEvents);
  router.post('/event', pushEventsValidator, EventController.pushEvents);

  return router;
}
