import { createConnections } from 'typeorm';
import config from '@/config';

export default async () => {
  try {
    // @ts-ignore : The database connection option has no type
    return await createConnections(config.db);
  } catch (e) {
    throw e;
  }
}
