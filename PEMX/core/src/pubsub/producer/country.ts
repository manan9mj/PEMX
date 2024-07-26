import PEMXConstants from '../../constant';
import { handleRetry } from '../../utils/retry';
import { ProducerInterface } from './interface';
import { Publish } from './producer';

export class CountryProducer extends Publish implements ProducerInterface {
  public async run(event: any) {
    // Action: Transferring to a country specific topic
    const topic = `${PEMXConstants.TOPIC.COUNTRY}-${
      event.data.country || 'US'
    }`;

    const messages = [
      { value: JSON.stringify(event), timestamp: `${new Date().getTime()}` },
    ];

    // Possible: Can perform various kinds of filtering based on event data
    // so that we can distribute it to various other topics with different configs

    this.logger.info(
      `EVENT_PUSH - TOPIC:${topic} - EventId:${event.eventId} - EventType:${event.eventType}`,
      messages,
    );

    // Action: Retrying producing events if it fails, max retries 3 with 3 secs interval
    await handleRetry(
      () => this.pushEvents(topic, messages),
      PEMXConstants.MAX_PRODUCE_EVENTS_RETRIAL,
      PEMXConstants.MAX_PRODUCE_EVENTS_RETRIAL_INTERVAL,
      `FAILURE:EVENT_PUSH - TOPIC:${topic} - EventId:${event.eventId} - EventType:${event.eventType}`,
    );
  }
}
