import cache from "@/loader/cache";
import redisClient from "@/loader/redis";
import { Holiday } from "@/model/entities/Holiday";
import check from "@/util/check";
import dayjs from "dayjs";
import { Service } from "typedi";
import { getConnection, getManager } from "typeorm";

@Service()
export default class CacheService {
  constructor() {
  }

  public static async Holiday(): Promise<void> {
    let holidayData = await getConnection('zz_tour')
    .getRepository(Holiday)
    .createQueryBuilder('holiday')
    .select([
      'holiday.holidayType AS holidayType',
      'JSON_ARRAYAGG(holiday.holidayDate) AS dates'
    ])
    .groupBy('holiday.holidayType')
    .getRawMany();

    holidayData = holidayData.reduce((acc, cur) => {
      acc[cur.holidayType] = cur.dates;
      return acc;
    }, {});

    await redisClient.set('holiday', JSON.stringify(holidayData));
    cache.holiday.set('holiday', JSON.stringify(holidayData));
  }

  public static async TourSchedule(fromDate, toDate): Promise<void> {
    // 하루 5번 예약 가능 + 추가 승인 가능 인데 최대 인원 찼을 때 가능 스케줄에 보여야하는지
    // 만일 인원수도 영향이 있다면 휴일 뿐 아니라 예약자 변동 시에도 계속 새로 캐싱해야함
    // 질문: 그렇다면 계속 변동되는 값인데 캐싱에 의미가 있을지
    // 기획이 불명확해 우선 휴일 변동시에만 갱신하도록 하고 예약자 수 함께 나오도록 쿼리만 작성
    const list = await getManager('zz_tour').query(`
      WITH RECURSIVE date_ranges
      AS
        (
              SELECT "${fromDate}" AS dt
              UNION ALL
              SELECT dt + INTERVAL 1 day
              FROM   date_ranges
              WHERE  dt < "${toDate}")
        SELECT    date_ranges.dt                  AS tourDate,
                  count(tour_reservation.user_id) AS joinCount
        FROM      date_ranges
        LEFT JOIN tour_reservation
        ON        tour_reservation.tour_date = date_ranges.dt
        AND       tour_reservation.cancel = FALSE
        GROUP BY  date_ranges.dt
    `);

    const dateData = {};
    for (let [idx, date] of list.entries()) {
      const isHoliday = await check.isHoliday(date.tourDate);
      if (isHoliday) {
        list.splice(idx, 1);
        continue;
      }
      
      const yearMonth = dayjs(date.tourDate).tz().format('YYYY-MM'); // 2023-11
      const day = dayjs(date.tourDate).tz().get('date');
      if (dateData.hasOwnProperty(yearMonth)) {
        dateData[yearMonth].push(day); // 날짜 push
      } else {
        dateData[yearMonth] = [day];
      }
    }
    
    await redisClient.set('schedule', JSON.stringify(dateData));
    cache.schedule.set('schedule', JSON.stringify(dateData));

    /*
    {
      '2023-12': [
        7, 10, 11, 12, 15,
        16, 17, 18, 19, 24,
        31
      ],
      '2024-01': [
        1,  2,  7,  8,  9, 14,
        15, 16, 21, 22, 23, 28,
        29, 30
      ]
    }
    */
  }
}