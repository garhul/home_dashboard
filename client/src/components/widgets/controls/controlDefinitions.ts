import { deviceStateData, sensorData } from "@backend/types";
const colors = ['#007bff', '#e83e8c', '#28a745', '#ffc107'];

export type DeviceControlType = {
  label: string | ((s: deviceStateData) => string);
  type: string;
  style?: string | ((s: deviceStateData) => string);
  payload: DevicePayloadType | ((s: deviceStateData) => DevicePayloadType);
  min?: string,
  max?: string,
  val?: string | ((s: deviceStateData) => string);
}

export type DevicePayloadType = {
  cmd: string,
  payload: string,
};

type sensorChannel = {
  icon: string;
  key: string;
  color: string;
  unit: string;
}

export type SensorCtrlType = {
  type: string;
  channels: sensorChannel[];
  data: (d: unknown & { data: sensorData }) => sensorData
  lastSeen: (n: unknown & { last_seen: number }) => number
};

export type DeviceControlsList = DeviceControlType[][];
export type GroupControlList = DeviceControlsList;
export type SensorCtrlTypeList = SensorCtrlType[][];

export const DeviceCtrl: DeviceControlsList = [
  [{
    label: 'Off',
    type: 'Button',
    style: 'outline-warning',
    payload: { cmd: 'off', payload: '' },
  }],
  [{
    label: ({ mode }) => (mode === 2) ? 'Pause' : 'Play',
    type: 'Button',
    style: ({ mode }) => (mode === 2) ? 'outline-light' : 'outline-success',
    payload: ({ mode }) => (mode === 2) ? { cmd: 'pause', payload: '' } : { cmd: 'play', payload: '' },
  }],
  [
    {
      label: 'Rainbow',
      type: 'Button',
      style: ({ fx }) => (fx === 1) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '1' },
    },
    {
      label: 'Opposites',
      type: 'Button',
      style: ({ fx }) => (fx === 4) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '4' },
    },
  ],
  [
    {
      label: 'Wavebow',
      type: 'Button',
      style: ({ fx }) => (fx === 2) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '2' },
    },
    {
      label: 'Chaser',
      type: 'Button',
      style: ({ fx }) => (fx === 6) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '6' },
    },
  ],
  [
    {
      label: 'Hue split',
      type: 'Button',
      style: ({ fx }) => (fx === 5) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '5' },
    },
    {
      label: 'White aurora',
      type: 'Button',
      style: ({ fx }) => (fx === 7) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '7' },
    },
  ],
  [
    {
      label: 'Aurora',
      type: 'Button',
      style: ({ fx }) => (fx === 3) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '3' },
    },
    {
      label: 'White chaser',
      type: 'Button',
      style: ({ fx }) => (fx === 8) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '8' },
    },
  ],
  [
    {
      label: 'Trippy',
      type: 'Button',
      style: ({ fx }) => (fx === 9) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '9' },
    },
  ],
  [
    {
      label: 'Transition Speed',
      type: 'Range',
      payload: { "cmd": "spd", "payload": "$1" },
      min: '0',
      max: '255',
      val: ({ spd }) => `${spd}`
    },
  ],
  [
    {
      label: 'Brightness',
      type: 'Range',
      payload: { "cmd": "br", "payload": "$1" },
      min: '0',
      max: '250',
      val: ({ br }) => `${br}`
    },
  ],
];

export const GroupCtrl: GroupControlList = [
  [{
    label: 'Off',
    type: 'Button',
    style: 'outline-warning',
    payload: { cmd: 'off', payload: '' },
  }],
  [{
    label: ({ mode }) => (mode === 2) ? 'Pause' : 'Play',
    type: 'Button',
    style: ({ mode }) => (mode === 2) ? 'outline-light' : 'outline-success',
    payload: ({ mode }) => (mode === 2) ? { cmd: 'pause', payload: '' } : { cmd: 'play', payload: '' },
  }],
  [
    {
      label: 'Rainbow',
      type: 'Button',
      style: ({ fx }) => (fx === 1) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '1' },
    },
    {
      label: 'Opposites',
      type: 'Button',
      style: ({ fx }) => (fx === 4) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '4' },
    },
  ],
  [
    {
      label: 'Wavebow',
      type: 'Button',
      style: ({ fx }) => (fx === 2) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '2' },
    },
    {
      label: 'Chaser',
      type: 'Button',
      style: ({ fx }) => (fx === 6) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '6' },
    },
  ],
  [
    {
      label: 'Hue split',
      type: 'Button',
      style: ({ fx }) => (fx === 5) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '5' },
    },
    {
      label: 'White aurora',
      type: 'Button',
      style: ({ fx }) => (fx === 7) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '7' },
    },
  ],
  [
    {
      label: 'Aurora',
      type: 'Button',
      style: ({ fx }) => (fx === 3) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '3' },
    },
    {
      label: 'White chaser',
      type: 'Button',
      style: ({ fx }) => (fx === 8) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '8' },
    },
  ],
  [
    {
      label: 'Trippy',
      type: 'Button',
      style: ({ fx }) => (fx === 9) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '9' },
    },
  ],
  [
    {
      label: 'Transition Speed',
      type: 'Range',
      payload: { "cmd": "spd", "payload": "$1" },
      min: '0',
      max: '255',
      val: ({ spd }) => `${spd}`
    },
    {
      label: 'Brightness',
      type: 'Range',
      payload: { "cmd": "br", "payload": "$1" },
      min: '0',
      max: '250',
      val: ({ br }) => `${br}`
    },
  ],
];

export const SensorCtrl: SensorCtrlTypeList = [
  [
    {
      type: 'sensor',
      channels: [
        {
          icon: 'TEMP',
          key: 't',
          color: colors[0],
          unit: 'C'
        },
        {
          icon: 'HUMID',
          key: 'h',
          color: colors[1],
          unit: '%'
        },
        {
          icon: 'PRES',
          key: 'p',
          color: colors[2],
          unit: 'hPa'
        }
      ],
      data: ({ data }) => data,
      lastSeen: ({ last_seen }) => (last_seen)
    }
  ]
];


// export const PayloadList: DevicePayloadTypeList = [
//   ['Off', '{"cmd"="off", "payload":""}'],
//   ['Play', ''],
//   ['Pause, ''],
// ]