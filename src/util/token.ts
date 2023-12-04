import config from '@/config';
import jwt from 'jsonwebtoken';

const token = {
  getJwtAccessToken: async (payload) => {
    const token = await jwt.sign(
      JSON.parse(JSON.stringify(payload)),
      config.token.accessTokenSecret,
      {
        expiresIn: Number(config.token.accessTokenExp)
      }
    );

    return token;
  }
}

export default token;