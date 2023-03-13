export type deviceData = {
  strip_size: number;
  device_id: string;
  stateString?: string;
  infoString?: string;
  topic: string;
  human_name: string;
  ip: string;
  build: string;
  state: deviceStateData;
  announce_topic?: string;
  ap_ssid?: string;
  broker?: string;
  use_mqtt?: boolean;
  ssid?: string;
};

export enum deviceModes {
  'OFF' = 0,
  'PAUSED' = 1,
  'PLAYING' = 2
};

//{"br":6,"spd":65,"fx":2,"mode":0,"size":88}
export type deviceStateData = {
  spd: number;
  fx: number;
  br: number;
  size: number;
  mode: number;
};

export type groupData = {
  id: string;
  name: string;
  deviceIds: string[];
};

type aggregatedData = {
  min: number | null;
  max: number | null;
  avg: number | null;
  median: number | null;
  last: number | null;
}

export type sensorData = {
  id: string;
  name: string;
  data: { key: string, series: timeSeriesSubset[] }[];
  last_seen: number;
}

export type expandedGroupData = groupData & {
  devices: deviceData[];
}

export type timeSeriesSubsetKey = 'Immediate' | 'Day' | 'Week' | 'Month' | 'Year';
export type timeSeriesDataPoint = [timestamp: number, value: number];

export type timeSeriesSubset = {
  key: timeSeriesSubsetKey;
  series: timeSeriesDataPoint[];
  timeWindow: number;
  extras: aggregatedData;
};

export type scheduleData = {
  hour: string;
  minute: string;
  day: string;
  month: string;
}

export type ruleActionData = [deviceId: string, payload: string];

export type RuleData = {
  id: string;
  name: string;
  schedule: string;
  actions: ruleActionData[]
}