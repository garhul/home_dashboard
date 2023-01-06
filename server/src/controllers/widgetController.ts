import { Groups } from '../services/db';
import { groupData, deviceData, stateData } from '../types';
import { getTaggedLogger } from '../services/logger';
import config from '../../config';

export async function getAll() {
  //build widgets based on current existing data for groups and devices


}


// function parsecontrols(controls, data) {
//   return controls.map(row => row.map(control => {
//     const ret = {};
//     Object.keys(control).forEach(prop => {
//       if (typeof control[prop] === 'function') {
//         ret[prop] = control[prop](data);
//       } else {
//         ret[prop] = control[prop];
//       }
//     });

//     return ret;
//   }));
// }