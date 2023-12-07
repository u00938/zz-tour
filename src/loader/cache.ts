import Cache from "node-cache";

const holiday = new Cache();
const schedule = new Cache();

const cache = {
  holiday,
  schedule
};

export default cache;