const redis = require('redis');
import config from '@/config';
import logger from './logger';

const redisClient = redis.createClient({ url: config.cache.redis });

redisClient.on('connect', () => logger.info(`Redis Client Connected!`));
redisClient.on('error', (e) => logger.error(`Redis Client Connection Error! : ${e.stack || e}`));

export default redisClient
