import cors from 'cors';
import express from 'express';
import Logger from './utils/logger';
import config from './config';
import PEMXConstants from './constant';
import { ErrorHandler } from './custom-errors/web-server-error';
import Process from './utils/process';
import mongodb from './db/mongodb';
import routers from './apis/router';
import { Publish } from './pubsub/producer/producer';
import { ProductEventStorageConsumer } from './pubsub/consumer/product-event-storage-consumer';

Process.on(async () => {
  const logger = Logger.getInstance();

  // Action: connect to database
  await mongodb();

  // Action: Initiate kafka producer/consumer
  await initializeKafkaPubSub();

  const app = express();
  app.use(express.json());

  const corsOptions = {
    origin: ['http://localhost:3000'],
  };
  app.use(cors(corsOptions));

  app.use(routers());

  app.listen(config.WEB_SERVER_PORT, () => {
    logger.info(`The server is listening on ${config.WEB_SERVER_PORT}.`, {
      log_point: PEMXConstants.LOG_POINTS.APPLICATION_START,
    });
  });

  app.use(ErrorHandler.handler);
});

Process.start();

async function initializeKafkaPubSub() {
  const producer = new Publish();
  await producer.connectProducer();
  const consumer = new ProductEventStorageConsumer();
  await consumer.connectConsumer();
}
