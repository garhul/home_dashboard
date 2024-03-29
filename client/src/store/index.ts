import create, { StateCreator } from 'zustand'
import { unstable_batchedUpdates } from 'react-dom';
import { groupData, deviceData, sensorData, RuleData } from '@backend/types';
import WS from './ws';
const apiURL = `http://${window.location.host.split(':')[0]}:1984/`;

interface DevicesSlice {
  devices: deviceData[];
  updateDevices(devices: deviceData[]): void;
  issueCMD(deviceIds: string[], payload: string): void;
};

interface GroupsSlice {
  groups: groupData[];
  updateGroups(groups: groupData[]): void;
};

interface SensorsSlice {
  sensors: sensorData[];
  updateSensors(sensors: sensorData[]): void;
};

interface RulesSlice {
  rules: RuleData[];
  addRule: (data: RuleData) => void //Promise<void>
  deleteRule: (id: string) => void //Promise<void>
}

interface SysSlice {
  wsConnected: boolean;
  setWsConnected(conn: boolean): void;
}

type StateType = DevicesSlice & GroupsSlice & SensorsSlice & RulesSlice & SysSlice;

const createDevicesSlice: StateCreator<StateType, [], [], DevicesSlice> = (set) => ({
  devices: [],
  updateDevices: (devices) => set((state) => ({ devices })),
  issueCMD: (deviceIds, payload) => updateRemote('devices', { deviceIds, payload }),
});

const createGroupsSlice: StateCreator<StateType, [], [], GroupsSlice> = (set) => ({
  groups: [],
  updateGroups: (u) => console.log(u),
});

const createSensorsSlice: StateCreator<StateType, [], [], SensorsSlice> = (set) => ({
  sensors: [],
  updateSensors: (sensors) => set((state) => ({ sensors })),
});

const createSchedulesSlice: StateCreator<RulesSlice, [], [], RulesSlice> = (set) => ({
  rules: [],
  addRule: (data) => console.log(data),
  deleteRule: (id) => console.log(id)
});

const createSysSlice: StateCreator<SysSlice, [], [], SysSlice> = (set) => ({
  wsConnected: false,
  setWsConnected: (conn) => set((state) => ({ wsConnected: conn }))
});

const updateRemote = async (entity: 'devices' | 'groups' | 'scheduler', payload) => {
  fetch(`${apiURL}${entity}`, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

const getRemote = async <T>(entity: 'devices' | 'groups' | 'sensors' | 'scheduler'): Promise<T> => {
  return fetch(`${apiURL}${entity}`).then(r => r.json()) as T;
};

const useStore = create<StateType>()((...a) => ({
  ...createDevicesSlice(...a),
  ...createGroupsSlice(...a),
  ...createSensorsSlice(...a),
  ...createSysSlice(...a),
  ...createSchedulesSlice(...a)
}));


async function initStore() {
  useStore.setState({
    devices: await getRemote<deviceData[]>('devices'),
    groups: await getRemote<groupData[]>('groups'),
    sensors: await getRemote<sensorData[]>('sensors'),
    rules: await getRemote<RuleData[]>('scheduler')
  });

  const ws = new WS();

  ws.on('open', (data: deviceData[]) => {
    unstable_batchedUpdates(() => {
      useStore.getState().setWsConnected(true)
    })
  });

  ws.on('close', (data: deviceData[]) => {
    unstable_batchedUpdates(() => {
      useStore.getState().setWsConnected(false)
    })
  });

  ws.on('DEVICES_UPDATE', (data: deviceData[]) => {
    unstable_batchedUpdates(() => {
      useStore.getState().updateDevices(data)
    })
  });

  ws.on('SENSORS_UPDATE', (data: sensorData[]) => {
    unstable_batchedUpdates(() => {
      useStore.getState().updateSensors(data)
    })
  });

  // init ws connection after setting the subscriptions to prevent missing the 'open' message
  ws.init();
}

initStore();
export default useStore;