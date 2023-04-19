import { Groups, Devices } from '../services/db';
import { groupData, deviceData, deviceStateData } from '../types';
import { getTaggedLogger } from '../services/logger';
import { getClient as getMQTTClient } from '../services/mqtt'
const logger = getTaggedLogger('GroupCTRL');

export function getAll() {
  return Groups.getAll().map(([_id, group]: [string, groupData]) => group);
}

export function get(id: string): groupData {
  return Groups.get(id);
}

export function del(id: string) {
  return Groups.del(id);
}

export async function issueCMD(groupId: string, payload: string) {
  //find which device is it  

  const topics = Groups.get(groupId).deviceIds.map(id => Devices.get(id).topic);
  topics.forEach(topic => {
    logger.info(`Emitting ${payload} to ${topic}`);
    getMQTTClient().publish(topic, payload);
  })
}

export async function add(id: string) {

}

export async function update(id: string, data: any) {

}