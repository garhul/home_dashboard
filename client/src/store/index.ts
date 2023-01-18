import create, { StateCreator } from 'zustand'
import { unstable_batchedUpdates } from 'react-dom';
import { groupData, deviceData, sensorData } from '@backend/types';
import WS from './ws';
const apiURL = `http://${window.location.host.split(':')[0]}:1984/`;

interface DevicesSlice {
  devices: deviceData[];
  load(): void;
  updateDevices(devices: deviceData[]): void;
  issueCMD(deviceIds: string[], payload: string): void;
};

interface GroupsSlice {
  groups: groupData[];
  updateGroups(groups: groupData[]): void;
};

interface SensorsSlice {
  sensors: sensorData[];
  loadSensors(): void;
  updateSensors(sensors: sensorData[]): void;
};

interface SysSlice {
  wsConnected: boolean;
  setWsConnected(conn: boolean): void;
}

type StateType = DevicesSlice & GroupsSlice & SensorsSlice & SysSlice;

const createDevicesSlice: StateCreator<StateType, [], [], DevicesSlice> = (set) => ({
  devices: [],
  load: async () => getRemote('devices').then(d => set((state) => ({ devices: d.map(kp => kp[1]) }))),
  updateDevices: (devices) => set((state) => ({ devices })),
  issueCMD: (deviceIds, payload) => updateRemote('devices', { deviceIds, payload }),
});

const createGroupsSlice: StateCreator<StateType, [], [], GroupsSlice> = (set) => ({
  groups: [],
  load: async () => getRemote('devices').then(d => set((state) => ({ devices: d }))),
  updateGroups: (u) => console.log(u),
});

const createSensorsSlice: StateCreator<StateType, [], [], SensorsSlice> = (set) => ({
  sensors: [],
  loadSensors: async () => getRemote('sensors').then(d => set((state) => ({ sensors: d }))),
  updateSensors: (sensors) => set((state) => ({ sensors })),
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

const getRemote = async (entity: 'devices' | 'groups' | 'sensors' | 'scheduler') => {
  return fetch(`${apiURL}${entity}`).then(r => r.json());
};


const useStore = create<StateType>()((...a) => ({
  ...createDevicesSlice(...a),
  ...createGroupsSlice(...a),
  ...createSensorsSlice(...a),
  ...createSysSlice(...a)
}));


async function initStore() {
  useStore.setState({
    devices: await getRemote('devices'),
    groups: await getRemote('groups'),
    sensors: await getRemote('sensors')
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

  ws.init(); // init ws connection after setting the subscriptions to connection to prevent missing the message
}

initStore();
export default useStore;