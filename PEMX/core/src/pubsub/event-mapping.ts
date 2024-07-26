import { ProductPriceUpdateProducer } from './producer/product-price-update';
import { CountryProducer } from './producer/country';
import { SpecificProductDiscountUpdateProducer } from './producer/specific-product-discount-update';

const EVENT_PRODUCER = {
  'ProductPriceUpdate': ProductPriceUpdateProducer,

  'Country': CountryProducer,

  'SpecificProductDiscountUpdate': SpecificProductDiscountUpdateProducer,
};

export default async function eventMapping(message: any) {
  const { eventType } = message;
  const eventProducer = new EVENT_PRODUCER[eventType]();
  await eventProducer.run(message);
}
