import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import middleware from '../middleware';
import TourService from '@/service/tour';

const route = Router();

export default (app: Router) => {
  app.use('/tour', route);

  route.post('/reservation',
    celebrate({
      body: Joi.object({

      })
    }),
    middleware.isAuth, middleware.attachUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');

      try {
        const result = await TourService.makeReservation(req.currentUser);
        return res.status(201).json(result);
      } catch (e) {
        logger.error('error %o', e);
        return next(e);
      }
    }
  );

}
