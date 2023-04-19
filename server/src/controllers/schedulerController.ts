import { SchedulerRules } from '../services/db';
import { RuleData } from '../types';
import { getTaggedLogger } from '../services/logger';
import { getClient as getMQTTClient } from '../services/mqtt'
const logger = getTaggedLogger('SchedulerCTRL');

export function getAll() {
  return SchedulerRules.getAll().map(([, val]) => val);
}

// export async function add(id: string) {

// }

export async function update(id: string, data: any) {
}


function triggerAction(rule: RuleData) {
  const client = getMQTTClient();


  // deviceIds.map(id => Devices.get(id).topic).forEach(topic => {
  //   logger.info(`Emitting ${payload} to ${topic}`);
  //   getMQTTClient().publish(topic, payload);
  // });
}