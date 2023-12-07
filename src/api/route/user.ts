import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import UserService from '@/service/user';

const route = Router();

export default (app: Router) => {
  app.use('/user', route);

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
        const result = await UserService.SignIn(req.body);
        return res.status(200).json(result);
      } catch (e) {
        logger.error('error %o', e);
        return next(e);
      }
    }
  );

}
