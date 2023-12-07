import { TourReservation } from '@/model/entities/TourReservation';
import check from '@/util/check';
import dayjs from 'dayjs';
import { Service } from 'typedi';
import { getConnection, getManager } from 'typeorm';
import CacheService from './cache';
import cache from '@/loader/cache';
import redisClient from '@/loader/redis';

@Service()
export default class TourService {
  constructor() {
  }

  public static async MakeReservation(currentUser, bodyData): Promise<object> {
    try {
      const { tourDate } = bodyData;

      // 날짜가 유효한지 체크
      // 당일 예약이 가능한지, 시간 등의 디테일 사항은 기획자 분과 소통 필요한 부분
      // 임의로 당일 예약 불가하게 설정
      if (dayjs(tourDate).tz().isSameOrBefore(dayjs().tz().format('YYYY-MM-DD'))) {
        const error = new Error(`예약 가능한 날짜가 아닙니다`);
        error.name = 'dev';
        throw error;
      }

      // 하루 5건의 예약만 가능하지만, 추가 승인이 가능하게 만들기 위해 우선 대기를 걸도록 구현
      const { reserved } = await getConnection('zz_tour')
      .getRepository(TourReservation)
      .createQueryBuilder('tourReservation')
      .select('COUNT(id)', 'reserved')
      .where('tourReservation.tour_date = :tourDate', { tourDate })
      .andWhere('tourReservation.approval = true AND tourReservation.cancel = false')
      .getRawOne();

      // 승인 or 대기 플래그
      const approval = reserved >= 5 ? false : true;

      const inserted = await getConnection('zz_tour').query(`
      SELECT insert_tour_reservation(?, ?, ?) AS _id
      `, [
        currentUser.id,
        tourDate,
        approval
      ]);

      if (inserted[0]._id === 'DUPLICATED RESERVATION') {
        const error = new Error(`이미 예약한 날짜입니다`);
        error.name = 'dev';
        throw error;
      }

      return {
        result: inserted[0]._id,
        message: approval ? '예약 접수되었습니다' : '예약 대기로 접수되었습니다'
      }
    } catch (e) {
      throw e;
    }
  }

  public static async CancelReservation(currentUser, bodyData): Promise<string> {
    try {
      const history = await getConnection('zz_tour')
      .getRepository(TourReservation)
      .findOne({
        where: {
          id: bodyData.id,
          userId: currentUser.id,
          cancel: false
        }
      });

      // 3일 전까지만 취소 가능
      if (history && dayjs(history.tourDate).tz().diff(dayjs().tz().format('YYYY-MM-DD'), 'day') < 3) {
        const error = new Error(`취소 가능한 날짜가 아닙니다\n고객센터에 문의해주세요`);
        error.name = 'dev';
        throw error;
      }

      const updated = await getConnection('zz_tour')
      .createQueryBuilder()
      .update(TourReservation)
      .set({
        cancel: 1
      })
      .where('id = :id', { id: bodyData.id })
      .execute();

      return `예약 취소되었습니다: ${history && updated.affected ? 1 : 0}건`;
    } catch (e) {
      throw e;
    }
  }

  public static async GetTourSchedule(queryData): Promise<Array<string>> {
    const { YYYY, MM } = queryData;

    const lastDay = dayjs(`${YYYY}-${MM}-01`).tz().endOf('month').format('YYYY-MM-DD');
    // 지난 날짜일때 빈 배열 리턴
    if (dayjs(lastDay).tz().isBefore(dayjs().tz())) {
      return [];
    }

    let scheduleCache;
    if (cache.schedule.get('schedule')) {
      scheduleCache = cache.schedule.get('schedule');
    } else {
      scheduleCache = await redisClient.get('schedule');
    }

    if (!scheduleCache) {
      // 오늘부터
      // 요청일이 들어있는 해당 월 말
      const fromDate = dayjs().tz().format('YYYY-MM-DD');
      const toDate = lastDay;

      await CacheService.TourSchedule(fromDate, toDate);
      scheduleCache = cache.schedule.get('schedule');
    }

    scheduleCache = JSON.parse(scheduleCache);

    // 클라이언트에서 미리 다 가지고 있는다면 그대로 줘도 될듯
    return scheduleCache[`${YYYY}-${MM}`];
  }
}
