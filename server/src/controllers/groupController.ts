import { Groups } from '../services/db';
import { groupData, deviceData, deviceStateData } from '../types';
import { getTaggedLogger } from '../services/logger';
// import config from '../../config';
const logger = getTaggedLogger('GroupCTRL');

export async function getAll() {
  return Groups.getAll();
}

export function get(id: string): groupData {
  return Groups.get(id);
}

export function del(id: string) {
  return Groups.del(id);
}

export async function add(id: string) {

}

export async function update(id: string, data: any) {

}

export async function issueCMD(id: string, cmdData: any) {

}