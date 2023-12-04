import { Container } from 'typedi';
import { Logger } from 'winston';
import { getManager } from 'typeorm';
import { AdminUser } from '@/model/entities/AdminUser';

const attachAdminUser = async (req, res, next) => {
  const Logger: Logger = Container.get('logger');
  try {
    const user = await getManager('zz_tour').findOne(AdminUser, { id: req.token.id });

    if (!user) {
      const error = new Error('Unauthorized');
      error.name = 'dev';
      error['status'] = 401;
      throw error;
    }

    delete user.pwdHash;
    
    req.currentUser = user;
    return next();
  } catch (e) {
    Logger.error('Error attaching admin user to req: %o', e);
    return next(e);
  }
};

export default attachAdminUser;
