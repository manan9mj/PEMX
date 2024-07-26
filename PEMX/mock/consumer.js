import { Kafka } from 'kafkajs';

export default async function init() {
  const topics = [
    'product-price-update-v1-US',
    'product-price-update-v1-EU',
    'country-UnitedStates',
    'country-Sweden',
    'specific-product-discount-update-US',
    'specific-product-discount-update-EU',
  ];

  const kafka = new Kafka({
    clientId: 'pemx-platform',
    brokers: ['localhost:9092', 'localhost:9092'],
  });

  topics.forEach(async (topic) => {
    const consumer = kafka.consumer({ groupId: `test-group-${topic}` });
    await consumer.connect();

    await handleRetry(() => consumerSubscribe(consumer, topic));

    console.log('MOCK_PRODUCER:CONNECTED');

    await consumer.run({
      eachMessage: ({ topic, partition, message }) => {
        const decodedMessage = {
          timestamp: message.timestamp,
          value: JSON.parse(message.value.toString()),
        };

        console.info(
          `MOCK_CONSUMER:EVENT_CONSUMED - TOPIC:${topic} - CONSUMER:test-group-${topic} - EventId:${decodedMessage.value.eventId} - EventType:${decodedMessage.value.eventType}`,
          { topic, partition, message: JSON.stringify(decodedMessage) },
        );
      },
    });
  });
}

async function consumerSubscribe(consumer, topic) {
  try {
    await consumer.subscribe({
      topic: topic,
      fromBeginning: true,
    });
    return true;
  } catch (error) {
    console.error(
      `FAILURE:MOCK_CONSUMER: Error subscribing to topic ${topic} by consumer group id test-group-${topic} - ${error}`,
    );
    return false;
  }
}

async function handleRetry(retryMethod) {
  let retryCount = 0;
  const maxRetries = 3;
  const retryInterval = 3;
  while (retryCount < maxRetries) {
    const result = await retryMethod();
    if (result) return;

    retryCount += 1;
    if (retryCount === maxRetries) {
      console.error(
        `Max retries reached ${retryCount}, not retrying anymore..`,
      );
      throw new Error(
        `Max retries reached ${retryCount}, not retrying anymore..`,
      );
    }
    console.error(
      `FAILURE:MOCK_CONSUMER: retrying in ${retryInterval} secs`,
      {},
    );

    await wait(3);
  }
}

const wait = (timeInSeconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeInSeconds * 1000);
  });
};
