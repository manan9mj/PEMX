/**
 * Stores all env configurations and their default values.
 */
export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  WEB_SERVER_PORT: process.env.WEB_SERVER_PORT || 8080,
  MONGODB_URI: process.env.MONGODB_URI,
  CLIENT_ID: process.env.CLIENT_ID,
  BROKER: process.env.BROKER,
};
