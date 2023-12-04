import { Service } from 'typedi';

@Service()
export default class TourService {
  constructor() {
  }

  public static async makeReservation(currentUser): Promise<object> {
    try {

      return {};
    } catch (e) {
      throw e;
    }
  }
}
