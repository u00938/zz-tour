import { AdminUser } from '@/model/entities/AdminUser';
import { Holiday } from '@/model/entities/Holiday';
import { TourReservation } from '@/model/entities/TourReservation';
import { User } from '@/model/entities/User';
import { getBoolean } from '@/util/cast';
import token from '@/util/token';
import dayjs from 'dayjs';
import { Service } from 'typedi';
import { getConnection, getManager } from 'typeorm';
import CacheService from './cache';
import cache from '@/loader/cache';

@Service()
export default class AdminService {
  constructor() {
  }

  public static async SignIn(userData): Promise<object> {
    try {
      // 간단한 인증 용도로, 회원가입 로직이 생략되었기 때문에 비밀번호 암호화/해독 과정 또한 생략
      const user = await getManager('zz_tour').findOne(AdminUser, { 
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

  public static async GetReservationUser(queryData): Promise<Array<object>> {
    try {
      const list = await getConnection('zz_tour')
      .getRepository(TourReservation)
      .createQueryBuilder('tourReservation')
      .select([
        'tourReservation.id AS tourReservationId',
        'tourReservation.status_text AS statusText',
        'user.id AS userId',
        'user.username AS username',
      ])
      .innerJoin(User, 'user', 'user.id = tourReservation.user_id')
      .where('tourReservation.tour_date = :tourDate', { tourDate: queryData.date })
      .getRawMany();

      return list;
    } catch (e) {
      throw e;
    }
  }  

  public static async ApproveReservation(bodyData): Promise<string> {
    try {
      const history = await getConnection('zz_tour')
      .getRepository(TourReservation)
      .findOne({
        where: {
          id: bodyData.id
        }
      });

      if (!history) {
        const error = new Error(`유효하지 않은 내역`);
        error.name = 'dev';
        throw error;
      }

      if (history.cancel) {
        const error = new Error(`이미 취소된 예약 건`);
        error.name = 'dev';
        throw error;
      }

      if (dayjs(history.tourDate).tz().isSameOrBefore(dayjs().tz().format('YYYY-MM-DD'))) {
        const error = new Error(`예약 승인 불가한 날짜`);
        error.name = 'dev';
        throw error;
      }

      const updated = await getConnection('zz_tour')
      .createQueryBuilder()
      .update(TourReservation)
      .set({
        approval: 1
      })
      .where('id = :id', { id: bodyData.id })
      .execute();

      return `id - ${bodyData.id} 승인: ${getBoolean(updated.affected)}`;
    } catch (e) {
      throw e;
    }
  }

  public static async AddTourHoliday(bodyData): Promise<string> {
    const {
      holidayType,
      holidayDate
    } = bodyData;

    const holiday = await getConnection('zz_tour')
    .getRepository(Holiday).findOne({
      holidayType,
      holidayDate
    });

    // 이 경우 중복값이라고 해서 에러 낼 필요는 없다고 판단 - 없을 경우만 insert, 캐시 갱신
    if (!holiday) {
      await getConnection('zz_tour')
      .createQueryBuilder()
      .insert()
      .into(Holiday)
      .values({
        holidayType,
        holidayDate
      })
      .execute();

      // 가능한 스케줄 리스트 캐시, 휴일 캐시 갱신
      // 우선 3개월까지 갖고있는걸로
      await CacheService.Holiday();

      const fromDate = dayjs().tz().format('YYYY-MM-DD');
      const toDate = dayjs(fromDate).tz().add(3, 'month').endOf('month').format('YYYY-MM-DD');

      await CacheService.TourSchedule(fromDate, toDate);
    }

    return 'success';
  }  
}
