import config from './config';

export default abstract class PEMXConstants {
  static readonly LOG_POINTS = {
    APPLICATION_START: 'APPLICATION_START',
    APPLICATION_STOP: 'APPLICATION_STOP',
  };

  static readonly WAIT_TIME_BEFORE_EXIT =
    config.NODE_ENV === 'development' ? 0 : 5 * 60; // 5 mins

  static readonly MAX_MONGO_CONNECTION_RETRIES = 10;

  static readonly CONSUMER_GROUP_ID = {
    PRODUCT_EVENT_STORAGE_CONSUMER_PEMX: 'product-event-storage-consumer-pemx',
    PRODUCT_EVENT_CONSUMER_PEMX: 'product-event-consumer-pemx',
  };

  static readonly TOPIC = {
    PRODUCT_EVENT_STORAGE_PEMX: 'product-event-storage-pemx',
    PRODUCT_EVENT: 'product-event',
    PRODUCT_PRICE_UPDATE_V1: 'product-price-update-v1',
    COUNTRY: 'country',
    SPECIFIC_PRODUCT_DISCOUNT_UPDATE: 'specific-product-discount-update',
  };

  static readonly MAX_CONSUMER_SUBSCRIBE_RETRIAL = 3;

  static readonly MAX_CONSUMER_SUBSCRIBE_RETRIAL_INTERVAL = 3; // 3 secs

  static readonly MAX_PRODUCE_EVENTS_RETRIAL = 3;

  static readonly MAX_PRODUCE_EVENTS_RETRIAL_INTERVAL = 3; // 3 secs
}
