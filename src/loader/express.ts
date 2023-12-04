import express, { Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routes from '@/api';
import { errors } from 'celebrate';
import logger from '@/loader/logger';

export default ({ app }: { app: express.Application }) => {

  app.use(morgan((tokens, req, res) => {
    // time: ms
    logger.http(`method: %o, url: %o, status: %o, user: %o, headers: %o, path: %o, params: %o, query: %o, body: %o, length: %o time: %o`,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      req.headers,
      req.path,
      req.params,
      req.query,
      req.body,
      tokens.res(req, res, 'content-length'),
      tokens['response-time'](req, res)
    );
    return null;
  }))

  app.get('/healthcheck', (req, res) => {
    res.status(200).end('OK!');
  });

  app.head('/healthcheck', (req, res) => {
    res.status(200).end();
  });

  app.enable('trust proxy');
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', routes());

  app.use(errors());

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    logger.error(`${req.path} - Not Found`);
    return res.status(404).send({ error: { message: 'Not Found' } }).end();
  });

  /// error handlers
  app.use((err, req, res, next) => {
    logger.error(`LOGGER MESSAGE - ${req.path} - %o`, err);
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }

    if (err.message === 'Unauthorized') {
      return res
      .status(err.status)
      .send({ errors: { message: err.message } })
      .end();
    }

    return next(err);
  });  

  // custom error
  app.use(async (err, req: Request, res: Response, next) => {
    if (err.name === 'dev') {
      return res.status(400).json({
        errors: {
          message: err['message']
        }
      })
      .end();
    } 
    return next(err);
  });

  app.use((err, req: Request, res: Response, next) => {
    res
      .status(err['status'] || 500)
      .json({
        errors: {
          message: err['message'],
        },
      })
      .end();
  });
}
