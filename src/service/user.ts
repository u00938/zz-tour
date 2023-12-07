import { User } from '@/model/entities/User';
import token from '@/util/token';
import { Service } from 'typedi';
import { getManager } from 'typeorm';

@Service()
export default class UserService {
  constructor() {
  }

  public static async SignIn(userData): Promise<object> {
    try {
      // 간단한 인증 용도로, 회원가입 로직이 생략되었기 때문에 비밀번호 암호화/해독 과정 또한 생략
      const user = await getManager('zz_tour').findOne(User, { 
        where: {
          email: userData.email,
          pwdHash: userData.password
        }
      });

      if (!user) {
        const error = new Error(`존재하지 않는 아이디입니다`);
        error.name = 'dev';
        throw error;
      }

      delete user.pwdHash;

      const accessToken = await token.getJwtAccessToken(user);

      return { accessToken };
    } catch (e) {
      throw e;
    }
  }
}
