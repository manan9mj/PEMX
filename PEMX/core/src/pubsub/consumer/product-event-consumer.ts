import { Consumer as KafkaConsumer } from 'kafkajs';
import PEMXConstants from '../../constant';
import { handleRetry } from '../../utils/retry';
import EventMapping from '../event-mapping';
import { ProductEventStorageProducer } from '../producer/product-event-storage-producer';
import { Consumer } from './consumer';
import { ConsumerInterface } from './interface';

/**
 * Action: This will consume all the events produced by on-premise system
 */
export class ProductEventsConsumer extends Consumer implements ConsumerInterface {
  public async connectConsumer() {
    this.logger.info(
      `EVENT_CONSUMER: Started connecting to consumer group - ${PEMXConstants.CONSUMER_GROUP_ID.PRODUCT_EVENT_CONSUMER_PEMX}`,
    );

    const consumer = this.kafka.consumer({
      groupId: PEMXConstants.CONSUMER_GROUP_ID.PRODUCT_EVENT_CONSUMER_PEMX,
    });

    await consumer.connect();

    this.logger.info(
      `EVENT_CONSUMER: Connected to consumer group - ${PEMXConstants.CONSUMER_GROUP_ID.PRODUCT_EVENT_CONSUMER_PEMX}`,
    );

    this.logger.info(
      `EVENT_CONSUMER: Started subscribing to topic - ${PEMXConstants.TOPIC.PRODUCT_EVENT}`,
    );

    // Action: Retrying consumer subscribe if it fails, max retries 3 with 3 secs interval
    await handleRetry(
      () => this.consumerSubscribe(consumer),
      PEMXConstants.MAX_CONSUMER_SUBSCRIBE_RETRIAL,
      PEMXConstants.MAX_CONSUMER_SUBSCRIBE_RETRIAL_INTERVAL,
      `FAILURE:EVENT_CONSUMER - TOPIC: ${PEMXConstants.TOPIC.PRODUCT_EVENT}`,
    );

    this.logger.info(
      `EVENT_CONSUMER: Subscribed to topic - ${PEMXConstants.TOPIC.PRODUCT_EVENT}`,
    );

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const decodedMessage = {
          timestamp: message.timestamp,
          value: JSON.parse(message.value.toString()),
        };
        this.logger.info(
          `EVENT_CONSUMED - TOPIC:${PEMXConstants.TOPIC.PRODUCT_EVENT} - CONSUMER:${PEMXConstants.CONSUMER_GROUP_ID.PRODUCT_EVENT_CONSUMER_PEMX} - EventId:${decodedMessage.value.eventId} - EventType:${decodedMessage.value.eventType}`,
          { topic, partition, decodedMessage },
        );

        // Possible: Validation of message with schema registry
        // Possible: Can raise alerts if invalidated events received
        // Possible: Can put some analytics on events

        // Action: Passing these events to event mapper for the correct distribution
        await EventMapping(decodedMessage.value);

        // Action: Passing these events to a topic event-storage-pemx, eventually storing it to DB
        const productEventStorageProducer = new ProductEventStorageProducer();
        await productEventStorageProducer.run(decodedMessage.value);
      },
    });
  }

  private async consumerSubscribe(consumer: KafkaConsumer) {
    try {
      await consumer.subscribe({
        topic: PEMXConstants.TOPIC.PRODUCT_EVENT,
        fromBeginning: true,
      });
      return true;
    } catch (error) {
      this.logger.error(
        `FAILURE:EVENT_CONSUMER: Error subscribing to topic ${PEMXConstants.TOPIC.PRODUCT_EVENT} by consumer group id ${PEMXConstants.CONSUMER_GROUP_ID.PRODUCT_EVENT_CONSUMER_PEMX} - ${error.message}`,
        { error },
      );
      return false;
    }
  }
}
