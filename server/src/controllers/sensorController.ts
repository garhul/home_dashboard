
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
    // console.log(parsedData);
    // const sensorObj = {
    //   id,
    //   name, 
    //   data: parsedData.map(([key, timeSeries]: [string, TimeSeries]) => ({ key, series: timeSeries.getData() }))
    // };


    // if (Sensors.exists(id)) {
    //   const s = Sensors.get(id); // logger.info(Sensors.get(id));
    //   s.data = 
    // } else {

    // }
  } catch (err) {
    logger.error(err);
  }
};

export function getAll() {
  return Sensors.getAll().map(s => s[1]);
}