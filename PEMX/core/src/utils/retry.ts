import Logger from './logger';
import wait from './wait';

// Possible - exponential retrial strategies
export const handleRetry = async (
  retryMethod: Function,
  maxRetries: number,
  retryInterval: number,
  failureMessage: string,
) => {
  const logger = Logger.getInstance();

  let retryCount = 0;
  while (retryCount < maxRetries) {
    const result: boolean = await retryMethod();
    if (result) return;

    retryCount += 1;
    if (retryCount === maxRetries) {
      // Possible: Raise Alerts, Send Emails

      logger.error(`${failureMessage}`, {});
      throw new Error(`Max retries reached ${retryCount}, not retrying anymore..`);
    }
    logger.error(`${failureMessage}, retrying in ${retryInterval} secs`, {});

    await wait(retryInterval);
  }
};
