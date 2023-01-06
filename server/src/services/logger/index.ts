import PinoHttp from 'pino-http';
import Pino from 'pino';
import cfg from '../../../config';

export const logger = Pino();
logger.level = cfg.logger.level;

export const getTaggedLogger = (tag: string) => logger.child({tag});
export const httpLogger = PinoHttp()

