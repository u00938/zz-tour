import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import AdminService from '@/service/admin';
import middleware from '../middleware';

const route = Router();

export default (app: Router) => {
  app.use('/admin', route);

  route.post('/signin',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');

      try {
        const result = await AdminService.SignIn(req.body);
        return res.status(200).json(result);
      } catch (e) {
        logger.error('error %o', e);
        return next(e);
      }
    }
  );

  route.get('/tour/reservation/user',
    celebrate({
      query: Joi.object({
        date: Joi.string().required()
      })
    }),
    middleware.isAuth, middleware.attachAdminUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');

      try {
        const result = await AdminService.GetReservationUser(req.query);
        return res.status(200).json(result);
      } catch (e) {
        logger.error('error %o', e);
        return next(e);
      }
    }
  );  

  route.put('/tour/reservation/approval',
    celebrate({
      body: Joi.object({
        id: Joi.string().required()
      })
    }),
    middleware.isAuth, middleware.attachAdminUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');

      try {
        const result = await AdminService.ApproveReservation(req.body);
        return res.status(200).json(result);
      } catch (e) {
        logger.error('error %o', e);
        return next(e);
      }
    }
  );  

}
