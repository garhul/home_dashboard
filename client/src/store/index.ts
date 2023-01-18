import create, { StateCreator } from 'zustand'
import { unstable_batchedUpdates } from 'react-dom';
import { groupData, deviceData, sensorData } from '@backend/types';
import bus from '../data';
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

type StateType = DevicesSlice & GroupsSlice & SensorsSlice;

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

bus.on('DEVICES_UPDATE', (data) => {
  unstable_batchedUpdates(() => {
    useStore.getState().updateDevices(data)
  })
});

bus.on('SENSORS_UPDATE', (data) => {
  unstable_batchedUpdates(() => {
    useStore.getState().updateSensors(data)
  })
});

const useStore = create<DevicesSlice & GroupsSlice & SensorsSlice>()((...a) => ({
  ...createDevicesSlice(...a),
  ...createGroupsSlice(...a),
  ...createSensorsSlice(...a)
}));


async function initStore() {
  useStore.setState({
    devices: await getRemote('devices'),
    groups: await getRemote('groups'),
    sensors: await getRemote('sensors')
  });
}

initStore();
export default useStore;

// /*
//  The initial state shapes what values we can have in our store.
//  We can order them as we like or use multiple stores.
//  For our game, I'll use only one store.

//  Our server only sends the game state updates so that's almost all we need.
//  We use the 'ready' state to know if we are connected to the server or not.
// */
// const initialState = {
//   game: null,
//   ready: false,
// };

// /*
//  Here we have access to two functions that
//  let us mutate or get data from our state.

//  This is where the magic happens, we can fully hide
//  the WebSocket implementation here and then use our store anywhere in our app!
//  */
// const mutations = (setState, getState) => {
//   const socket = ioClient();

//   // this is enough to connect all our server events
//   // to our state managment system!
//   socket
//     .on("connect", () => {
//       setState({ ready: true });
//     })
//     .on("disconnect", () => {
//       setState({ ready: false });
//     })
//     .on("state", (gameState) => {
//       setState({ game: gameState });
//     });

//   return {
//     actions: {
//       startGame() {
//         socket.emit("start-game");
//       },

//       play(boxId: number) {
//         const isPlayerTurn = getState().game?.playerTurn === Players.PLAYER;

//         if (isPlayerTurn) {
//           socket.emit("play", boxId);
//         }
//       },
//     },
//   };
// };

//We created our first store!
// export const useStore = create(combine(initialState, mutations));