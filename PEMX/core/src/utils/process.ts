import PEMXConstants from '../constant';
import Logger from './logger';
import wait from './wait';

const logger = Logger.getInstance();

type HandlerFn = () => any;

class Process {
  public static shuttingDown = false;

  private static startMethod?: HandlerFn;

  public static stop = async (exitCode: number = 0) => {
    Process.shuttingDown = true;

    logger.debug(
      'Process.stop method called. marked Process.shuttingDown as true',
      {
        log_point: PEMXConstants.LOG_POINTS.APPLICATION_STOP,
        'process.shuttingDown': Process.shuttingDown,
      },
    );

    await Process.exitProcess(exitCode);
  };

  public static start = () => {
    const loggingMetadata = {
      log_point: PEMXConstants.LOG_POINTS.APPLICATION_START,
      attributes: {},
    };

    /**
     * Possible: Can send possible alerts or emails on below process events
     */

    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received', loggingMetadata);
      Process.stop();
    });
    process.on('SIGINT', () => {
      logger.info('SIGINT signal received', loggingMetadata);
      Process.stop();
    });

    process.on('uncaughtException', async (error: Error) => {
      logger.error(`UNCAUGHT_EXCEPTION: : ${error.message}`, {
        ...loggingMetadata,
        'error.description': error.message,
        'error.stack': error.stack,
      });
    });

    process.on('unhandledRejection', async (error: Error) => {
      logger.error(`UNHANDLED_REJECTION: ${error.message}`, {
        ...loggingMetadata,
        'error.description': error.message,
        'error.stack': error.stack,
      });
    });

    if (Process.startMethod) {
      Process.startMethod();
    }
  };

  public static on = (fn: HandlerFn) => {
    Process.startMethod = fn;
  };

  /**
   * Actions: Wait for some time before exiting the process
   * so that logs are completely uploaded
   */
  public static exitProcess = async (exitCode: number = 0) => {
    logger.info(
      `Waiting for ${PEMXConstants.WAIT_TIME_BEFORE_EXIT} seconds before exiting with code: ${exitCode}`,
      {
        log_point: PEMXConstants.LOG_POINTS.APPLICATION_STOP,
        attributes: {},
      },
    );

    await wait(PEMXConstants.WAIT_TIME_BEFORE_EXIT);

    process.exit(exitCode);
  };
}

export default Process;
