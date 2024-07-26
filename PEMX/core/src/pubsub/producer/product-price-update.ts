import PEMXConstants from '../../constant';
import { handleRetry } from '../../utils/retry';
import { ProducerInterface } from './interface';
import { Publish } from './producer';

export class ProductPriceUpdateProducer extends Publish implements ProducerInterface {
  public async run(event: any) {
    // Possible: Can perform various kinds of filtering based on event data.
    // Possible: so that we can distribute it to various other topics with different configs
    // Action: Below the event is producing to topic 'product-price-update-v1-US', if event region is US. Also notice this topic is specific to version 1 of events.

    const topic = `${PEMXConstants.TOPIC.PRODUCT_PRICE_UPDATE_V1}-${event.region}`;

    const messages = [
      { value: JSON.stringify(event), timestamp: `${new Date().getTime()}` },
    ];

    this.logger.info(`EVENT_PUSH - TOPIC:${topic} - EventId:${event.eventId} - EventType:${event.eventType}`, messages);

    // Action: Retrying producing events if it fails, max retries 3 with 3 secs interval
    await handleRetry(
      () => this.pushEvents(topic, messages),
      PEMXConstants.MAX_PRODUCE_EVENTS_RETRIAL,
      PEMXConstants.MAX_PRODUCE_EVENTS_RETRIAL_INTERVAL,
      `FAILURE:EVENT_PUSH - TOPIC:${topic} - EventId:${event.eventId} - EventType:${event.eventType}`,
    );
  }
}
