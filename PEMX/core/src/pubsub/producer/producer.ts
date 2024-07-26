import { Kafka, Producer as KafkaProducer } from 'kafkajs';
import Logger from '../../utils/logger';
import { KafkaPEMX } from '../kafkaPEMX';

export class Publish {
  public static producer: KafkaProducer;
  logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }

  // Action: Sharing a single producer connection across all producer
  public async connectProducer() {
    if (Publish.producer) return;

    const kafka: Kafka = KafkaPEMX.getInstance().kafka;
    Publish.producer = kafka.producer();
    this.logger.info('EVENT_PRODUCER: Creating a new producer connection', {});
    await Publish.producer.connect();
  }

  public async pushEvents(
    topic: string,
    messages: { value: string; timestamp: string }[],
  ) {
    try {
      await Publish.producer.send({
        topic,
        messages,
      });
      return true;
    } catch (error) {
      this.logger.error(
        `FAILURE:EVENT_PUSH - Error pushing to topic ${topic} - ${error.message}`,
        {
          error,
          messages,
        },
      );
      return false;
    }
  }
}
