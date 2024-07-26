import PEMXConstants from '../../constant';
import { handleRetry } from '../../utils/retry';
import { Publish } from './producer';

export class ProductEventStorageProducer extends Publish {
  public async run(event: any) {
    const topic = PEMXConstants.TOPIC.PRODUCT_EVENT_STORAGE_PEMX;

    const messages = [
      {
        value: JSON.stringify(event),
        timestamp: `${new Date().getTime()}`,
      },
    ];

    this.logger.info(
      `EVENT_PUSH - TOPIC:${topic} - EventId:${event.eventId} - EventType:${event.eventType}`,
      messages,
    );

    // Action: Retrying producing events if it fails, max retries 3 with 3 secs interval
    await handleRetry(
      () => this.pushEvents(topic, messages),
      PEMXConstants.MAX_PRODUCE_EVENTS_RETRIAL,
      PEMXConstants.MAX_PRODUCE_EVENTS_RETRIAL_INTERVAL,
      `FAILURE:EVENT_PUSH - TOPIC${topic} - EventId:${event.eventId} - EventType:${event.eventType}`,
    );
  }
}
