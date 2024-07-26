import PEMXConstants from '../../constant';
import { handleRetry } from '../../utils/retry';
import { Publish } from './producer';

export class FallbackAPIProducer extends Publish {
  public async run(events: Object[]) {
    const topic = PEMXConstants.TOPIC.PRODUCT_EVENT;

    const messages = events.map((event) => {
      return {
        value: JSON.stringify(event),
        timestamp: `${new Date().getTime()}`,
      };
    });

    this.logger.info(
      `EVENT_PUSH:BULK:FALLBACK_API - TOPIC:${topic} - COUNT:${messages.length}`,
      messages,
    );

    // Action: Retrying producing events if it fails, max retries 3 with 3 secs interval
    await handleRetry(
      () => this.pushEvents(topic, messages),
      PEMXConstants.MAX_PRODUCE_EVENTS_RETRIAL,
      PEMXConstants.MAX_PRODUCE_EVENTS_RETRIAL_INTERVAL,
      `FAILURE:EVENT_PUSH:BULK:FALLBACK_API - TOPIC:${topic} - COUNT:${messages.length}}`,
    );
  }
}
