import { Kafka } from 'kafkajs';
import Logger from '../../utils/logger';
import { KafkaPEMX } from '../kafkaPEMX';

export class Consumer {
  logger: Logger;
  kafka: Kafka;

  constructor() {
    this.logger = Logger.getInstance();
    this.kafka = KafkaPEMX.getInstance().kafka;
  }
}
