import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
const conf = `.${process.env.NODE_ENV}.env`;
const env = dotenv.config({ path: conf });
if (env.error) {
  throw new Error('Couldn\'t find .env file');
}

export default {
  port: parseInt(process.env.NODE_PORT, 10),
  logs: {
    level: process.env.LOG_LEVEL || 'silly'
  },
  db: [
    {
      name: 'zz_tour',
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [process.env.TYPEORM_ENTITIES]
    }
  ],
  token: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExp: process.env.ACCESS_TOKEN_EXP
  },
  cache: {
    redis: process.env.REDIS_HOST,
    dayTtl: process.env.NODE_ENV === 'prod' ? 86400 : 60
  },
  swagger: process.env.SWAGGER_HOST
};
