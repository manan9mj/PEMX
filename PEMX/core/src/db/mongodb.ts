import mongoose from 'mongoose';
import config from '../config';
import Logger from '../utils/logger';
import PEMXConstants from '../constant';
import Process from '../utils/process';
import wait from '../utils/wait';

/**
 * Action: Connecting to MongoDB with max 10 retrials in case of connection errors
 */
export default async function mongodb() {
  const logger = Logger.getInstance();

  let connectionRetries = 1;

  await new Promise((resolve) => {
    const connect = async () => {
      try {
        await mongoose.connect(config.MONGODB_URI);
        logger.info('MongoDB Connected!', {});
        resolve('MongoDB Connected!');
      } catch (error) {
        logger.error(
          `MongoDB Connection Failed, Attempted Conn ${connectionRetries} - ${error.message}`,
          {
            'error.description': error.message,
            'error.stack': error.stack,
          },
        );

        if (connectionRetries === PEMXConstants.MAX_MONGO_CONNECTION_RETRIES) {
          logger.error('MongoDB Connection retries exceeded', {});
          Process.exitProcess(1);
          return;
        }

        logger.error('MongoDB Connection Retrying in 5 secs', {});
        connectionRetries += 1;
        await wait(5);
        connect();
      }
    };

    connect();
  });
}
