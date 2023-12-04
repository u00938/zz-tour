process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

import 'reflect-metadata';
import express from 'express';
import loader from '@/loader';
import Logger from '@/loader/logger';
import config from '@/config';

process.on('unhandledRejection', (error, promise) => {
  console.log('Forgot to handle the promise: ', promise);
  console.log('Error was : ', error);
});

async function startServer() {
  const app = express();

  await loader({ expressApp: app });

  app.listen(config.port, () => {
    Logger.info(`api server listening on port: ${config.port}`);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });

}

startServer();
