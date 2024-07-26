import { Consumer as KafkaConsumer } from 'kafkajs';
import { ProductEvent } from '../../apis/event-model';
import PEMXConstants from '../../constant';
import { Consumer } from './consumer';
import { handleRetry } from '../../utils/retry';

/**
 * Action: This will store all the events received by PEMX to MongoDB database
 */
export class ProductEventStorageConsumer extends Consumer {
  public async connectConsumer() {
    this.logger.info(
      `EVENT_CONSUMER: Started connecting to consumer group - ${PEMXConstants.CONSUMER_GROUP_ID.PRODUCT_EVENT_STORAGE_CONSUMER_PEMX}`,
    );

    const consumer = this.kafka.consumer({
      groupId: PEMXConstants.CONSUMER_GROUP_ID.PRODUCT_EVENT_STORAGE_CONSUMER_PEMX,
    });

    await consumer.connect();

    this.logger.info(
      `EVENT_CONSUMER: Connected to consumer group - ${PEMXConstants.CONSUMER_GROUP_ID.PRODUCT_EVENT_STORAGE_CONSUMER_PEMX}`,
    );

    this.logger.info(
      `EVENT_CONSUMER: Started subscribing to topic - ${PEMXConstants.TOPIC.PRODUCT_EVENT_STORAGE_PEMX}`,
    );

    // Action: Retrying consumer subscribe if it fails, max retries 3 with 3 secs interval 
    await handleRetry(
      () => this.consumerSubscribe(consumer),
      PEMXConstants.MAX_CONSUMER_SUBSCRIBE_RETRIAL,
      PEMXConstants.MAX_CONSUMER_SUBSCRIBE_RETRIAL_INTERVAL,
      `FAILURE:EVENT_CONSUMER - TOPIC:${PEMXConstants.TOPIC.PRODUCT_EVENT_STORAGE_PEMX}`,
    );

    this.logger.info(
      `EVENT_CONSUMER: Subscribed to topic - ${PEMXConstants.TOPIC.PRODUCT_EVENT_STORAGE_PEMX}`,
    );

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const decodedMessage = {
          timestamp: message.timestamp,
          value: JSON.parse(message.value.toString()),
        };
        this.logger.info(
          `EVENT_CONSUMED - TOPIC:${PEMXConstants.TOPIC.PRODUCT_EVENT_STORAGE_PEMX} - CONSUMER:${PEMXConstants.CONSUMER_GROUP_ID.PRODUCT_EVENT_STORAGE_CONSUMER_PEMX} - EventId:${decodedMessage.value.eventId} - EventType:${decodedMessage.value.eventType}`,
          { topic, partition, decodedMessage },
        );

        // Action: Storing into database
        const productEventObj = new ProductEvent(decodedMessage.value);
        productEventObj.save();
      },
    });
  }

  private async consumerSubscribe(consumer: KafkaConsumer) {
    try {
      await consumer.subscribe({
        topic: PEMXConstants.TOPIC.PRODUCT_EVENT_STORAGE_PEMX,
        fromBeginning: true,
      });
      return true;
    } catch (error) {
      this.logger.error(
        `FAILURE:EVENT_CONSUMER: Error subscribing to topic ${PEMXConstants.TOPIC.PRODUCT_EVENT_STORAGE_PEMX} by consumer group id ${PEMXConstants.CONSUMER_GROUP_ID.PRODUCT_EVENT_STORAGE_CONSUMER_PEMX} - ${error.message}`,
        { error },
      );
      return false;
    }
  }
}
