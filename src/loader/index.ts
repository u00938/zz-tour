import expressLoader from './express';
import mysqlLoader from './mysql';
import Logger from './logger';
import { Container } from 'typedi';
import redisClient from './redis';

export default async ({ expressApp }) => {
  Container.set('logger', Logger);

  await mysqlLoader();
  Logger.info('DB connected!');

  await redisClient.connect();

  await expressLoader({ app: expressApp });
  Logger.info('express loaded!');
}
