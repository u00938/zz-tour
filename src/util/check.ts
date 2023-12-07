import cache from "@/loader/cache";
import redisClient from "@/loader/redis";
import CacheService from "@/service/cache";
import dayjs from "dayjs";

const check = {
  isHoliday: async (date) => {
    let holidayCache;
    if (cache.holiday.get('holiday')) {
      holidayCache = cache.holiday.get('holiday');
    } else {
      holidayCache = await redisClient.get('holiday');
    }

    if (!holidayCache) {
      await CacheService.Holiday();
      holidayCache = cache.holiday.get('holiday');
    }

    holidayCache = JSON.parse(holidayCache)

    // 정기 휴일(day) 확인
    let dayHoliday = false;
    for (let day of holidayCache['day']) {
      if (dayjs(date).tz().day().toString() === day) {
        dayHoliday = true;
        // 정기 휴일일 경우 exception인지 확인
        if (holidayCache['except'].includes(date)) {
          dayHoliday = false;
        }
        break; // 정기 휴일 하나라도 겹쳤을 경우 break
      }
    }

    // 지정 휴일(date) 확인
    const dateHoliday = holidayCache['date'].includes(date);

    return dayHoliday || dateHoliday;
  }
}

export default check;