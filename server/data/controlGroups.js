module.exports = [{
  name: 'Living lights',
  topics: [
    'living/radiator_r',
    'living/radiator_l',
    'living/tree',
    'living/ikea_lamp'],
  control_template: 'group',
  state: {}
},{
  name: 'Radiators',
  topics: [
    'living/radiator_r',
    'living/radiator_l'
  ],
  control_template: 'group',
  state: {}
}];
