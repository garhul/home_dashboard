
import config from "../../config";
import { Sensors, processSensorData } from "../services/db";
import TimeSeries from "../services/db/timeSeries";
import { getTaggedLogger } from "../services/logger";
const logger = getTaggedLogger('SENSOR_CTRL');

export function addData(payload: any) {
  try {
    const { data, id, name } = JSON.parse(payload);
    const parsedData = processSensorData(id, Object.keys(data).map(k => [k, data[k]]));
    Sensors.add(id, {
      id,
      name,
      data: parsedData.map(([key, timeSeries]: [string, TimeSeries]) => ({ key, series: timeSeries.getData() })),
      last_seen: Date.now()
    });
  } catch (err) {
    logger.error(err);
  }
};

export function getAll() {
  return Sensors.getAll().map(s => s[1]).sort((a, b) => {
    if (a > b) return 1;
    if (b === a) return 0;
    return -1;
  });
}