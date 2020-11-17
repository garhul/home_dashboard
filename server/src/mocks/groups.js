module.exports = [{
  id: '123f',
  name: 'Living lights',
  topics: ['living/desk-lamp', 'living/fafafa'],
  devices: ['0xf44', '50f3f'],
  controls: [
    {
      name: 'Rainbow fx',
      type: 'Button',
      payload: '{"cmd": "fx", payload: 3 }',
    },
    {
      name: 'Aurora fx',
      type: 'Button',
      payload: '{"cmd": "fx", payload: 2 }',
    },
    {
      name: 'Effect speed',
      type: 'Slider',
      field: 'spd',
      payload: '{"cmd":"fx", "payload":$1}',
      min: '0',
      max: '100',
    },
    {
      name: 'Max brightness',
      type: 'Slider',
      field: 'br',
      payload: '{"cmd":"fx", "payload":$1}',
      min: '0',
      max: '100',
    },
  ],
}];
