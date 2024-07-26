import { ProductEventsConsumer } from './pubsub/consumer/product-event-consumer';
import {Publish} from './pubsub/producer/producer';
import Process from './utils/process';

Process.on(async () => {
  // Action: Initiate kafka producer/consumer
  await initializeKafkaPubSub();
});

Process.start();

async function initializeKafkaPubSub() {
  const producer = new Publish();
  await producer.connectProducer();
  const consumer = new ProductEventsConsumer();
  await consumer.connectConsumer();
}
