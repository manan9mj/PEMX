import { Kafka } from 'kafkajs';
import Logger from '../utils/logger';
import config from '../config';

export class KafkaPEMX {
  private static instance: KafkaPEMX;
  private logger: Logger;

  public kafka: Kafka;

  constructor(logger: Logger) {
    this.logger = logger;
    this.initKafkaPEMX();
  }

  public static getInstance() {
    if (KafkaPEMX.instance) {
      return this.instance;
    }

    this.instance = new KafkaPEMX(Logger.getInstance());
    return this.instance;
  }

  private initKafkaPEMX() {
    this.logger.info('Creating a new kafka instance');
    this.kafka = new Kafka({
      clientId: config.CLIENT_ID,
      brokers: [config.BROKER],
    });
  }
}
