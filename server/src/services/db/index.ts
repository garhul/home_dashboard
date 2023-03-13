import { deviceData, groupData, RuleData, sensorData, timeSeriesDataPoint, timeSeriesSubset } from '../../types';
import { getTaggedLogger } from '../logger';
import config from '../../../config';
import fs from 'fs';
import ObservableCollection from './observableCollection';
import TimeSeries from './timeSeries';

const logger = getTaggedLogger('DB');

function loadFromFile<T>(file: string): Array<[id: string, value: T]> {
  try {
    const retval = JSON.parse(fs.readFileSync(file).toString());
    return retval;
  } catch (err: any) {
    logger.error(`Unable to load file: ${file} ${err}`);
    return []
  }
}

function persistToFile<T>(data: Array<[id: string, value: T]>, filePath: string) {
  try {
    const parseableData = Array.from(data);
    fs.writeFileSync(filePath, JSON.stringify(parseableData));
  } catch (err) {
    logger.error(`Unable to persist o ${filePath} ${err}`);
  }
}

export const Devices = new ObservableCollection<deviceData>('Devices', loadFromFile<deviceData>(config.db.devicesFile));
Devices.onChange((d) => persistToFile<deviceData>(d, config.db.devicesFile));

export const Groups = new ObservableCollection<groupData>('Groups', loadFromFile<groupData>(config.db.groupsFile));
Groups.onChange((d) => persistToFile<groupData>(d, config.db.groupsFile));

export const SchedulerRules = new ObservableCollection<RuleData>('SchedulerRules', loadFromFile<RuleData>(config.db.schedulerRulesFile));

export const Sensors = new ObservableCollection<sensorData>('Sensors', null);
//TODO :: Implement persistence for sensor data
// Sensors.onChange((s) => persistToFile<sensorData>(s, config.db.sensorsFile));

const Series = new Map<string, TimeSeries>();
export function processSensorData(sensorId: string, dataPointCollection: [key: string, value: number][]) {

  const sensorTs = dataPointCollection.map(([key, value]: [string, number]): [string, TimeSeries] => {
    const normalizedVal = Math.ceil(value * 1000);
    const tsKey = `${sensorId}#${key}`;
    let timeSeries = Series.get(tsKey);
    if (!timeSeries)
      timeSeries = new TimeSeries(parseInt(config.sensors.timeSeriesDepth));
    timeSeries!.addSample(normalizedVal);
    Series.set(tsKey, timeSeries);
    return [key, timeSeries];
  });

  return sensorTs;
}