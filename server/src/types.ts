export type deviceData = {
  strip_size: number;
  device_id: string;
  stateString?: string;
  infoString?: string;
  topic: string;
  human_name: string;
  ip: string;
  build: string;
  state: stateData;
  announce_topic? :string;
  ap_ssid?: string;
  broker?:string;
  use_mqtt?:boolean;
  ssid?: string;
};

//{"br":6,"spd":65,"fx":2,"mode":0,"size":88}
export type stateData = {
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
