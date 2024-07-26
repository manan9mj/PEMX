import { Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

const eventTypes = [
  'ProductPriceUpdate',
  'Country',
  'SpecificProductDiscountUpdate',
];
const countryWithRegion = {
  US: { country: 'UnitedStates', region: 'US' },
  EU: { country: 'Sweden', region: 'EU' },
};
const region = ['US', 'EU'];

export default async function init() {
  const topic = 'product-event';

  const kafka = new Kafka({
    clientId: 'kafka-nodejs',
    brokers: ['localhost:9092', 'localhost:9092'],
  });

  const producer = kafka.producer();

  await producer.connect();

  console.log('MOCK_PRODUCER:CONNECTED')

  // Trigger for an event after every 5 secs, which will push an event in 0-10 secs.
  setInterval(
    () =>
      setTimeout(async () => {
        const event = generateMessage();
        const message = {
          value: JSON.stringify(event),
          timestamp: `${new Date().getTime()}`,
        };
        await producer.send({
          topic,
          messages: [message],
        });

        console.info(
          `MOCK_PRODUCER:EVENT_PUSH - TOPIC:${topic} - EventId:${event.eventId} - EventType:${event.eventType}`,
          message,
        );
      }, randomInteger(10) * 1000),
    5000,
  );
}

init();

let eventsWithSameproductId = 0
let productId = generateRandomAlphaNumeric(10);
function generateMessage() {
  if(!eventsWithSameproductId){
    productId = generateRandomAlphaNumeric(10);
  }
  eventsWithSameproductId = randomInteger(3);

  const eventType = eventTypes[randomInteger(eventTypes.length)];
  const eventRegion = region[randomInteger(region.length)];
  return {
    eventId: uuidv4(),
    eventType,
    productId,
    region: eventRegion,
    createdAt: new Date().toISOString(),
    data: getRandomData(eventType, eventRegion),
  };
}

const getRandomData = (eventType, region) => {
  const sample = {
    ProductPriceUpdate: {
      newPrice: randomInteger(1000) / 100,
      previousPrice: randomInteger(1000) / 100,
    },
    Country: countryWithRegion[region],
    SpecificProductDiscountUpdate: {
      newDiscountPercentage: randomInteger(100),
      previousDiscountPercentage: randomInteger(100),
    },
  };

  return sample[eventType];
};

function randomInteger(num) {
  return Math.floor(Math.random() * num);
}

function generateRandomAlphaNumeric(length) {
  const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
      result += alphanumericChars[randomIndex];
  }
  return result;
}

