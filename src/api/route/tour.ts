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
        tourDate: Joi.string().required()
      })
    }),
    middleware.isAuth, middleware.attachUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');

      try {
        const result = await TourService.MakeReservation(req.currentUser, req.body);
        return res.status(201).json(result);
      } catch (e) {
        logger.error('error %o', e);
        return next(e);
      }
    }
  );

  route.put('/reservation/cancel',
    celebrate({
      body: Joi.object({
        id: Joi.string().required()
      })
    }),
    middleware.isAuth, middleware.attachUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');

      try {
        const result = await TourService.CancelReservation(req.currentUser, req.body);
        return res.status(200).json(result);
      } catch (e) {
        logger.error('error %o', e);
        return next(e);
      }
    }
  );

  route.get('/schedule',
    celebrate({
      query: Joi.object({
        YYYY: Joi.string().required(),
        MM: Joi.string().required()
      })
    }),  
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');

      try {
        const result = await TourService.GetTourSchedule(req.query);
        return res.status(200).json(result);
      } catch (e) {
        logger.error('error %o', e);
        return next(e);
      }
    }
  );  

}
