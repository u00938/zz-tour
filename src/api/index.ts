import { Router } from 'express';
import user from './route/user';
import tour from './route/tour';
import admin from './route/admin';

export default () => {
  const app = Router();
  
  user(app);
  tour(app);
  admin(app);

  return app;
}