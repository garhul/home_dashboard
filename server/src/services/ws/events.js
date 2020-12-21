module.exports = {
  WIDGETS_UPDATE: 'WIDGETS_UPDATE', // used when widgets change on the backend to notify clients
  WIDGETS_LIST: 'WIDGETS_LIST',   // used by clients to request widgets list
  WIDGETS_CMD: 'WIDGETS_CMD', // used by clients to issue widget command
  DEVICES_SCAN: 'DEVICES_SCAN', // used by clients to issue a device scan

  SCHEDULER_ADD: 'SCHEDULER_ADD', // used by clients to request adding a scheduler rule
  SHEDULER_RM: 'SCHEDULER_RM', // used by clients to request removing a scheduler rule
  SCHEDULER_UPDATE: 'SCHEDULER_UP', // used by clients to request updating a scheduler rule
  SHECUDLER_LIST: 'SCHEDULER_LIST'  // used by clients to request listing scheduler rules
};
