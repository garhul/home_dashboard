module.exports = [
  [{
    label: 'Off',
    type: 'Button',
    style: 'outline-success',
    payload: '{ "cmd": "off", payload: "" }',
  }],
  [
    {
      label: 'Rainbow',
      type: 'Button',
      style: 'outline-warning',
      payload: '{ "cmd": "fx", "payload": "1" }',
    },
    {
      label: 'Aurora',
      style: 'outline-warning',
      type: 'Button',
      payload: '{ "cmd": "fx", "payload": "2" }',
    },
  ],
  [
    {
      label: 'Fire',
      type: 'Button',
      style: 'outline-danger',
      payload: '{ "cmd": "fx", "payload": "3" }',
    },
    {
      label: 'Chaser',
      type: 'Button',
      style: 'outline-danger',
      payload: '{ "cmd": "fx", "payload": "4" }',
    },
  ],
  [
    {
      label: 'Hue split',
      type: 'Button',
      payload: { cmd: 'fx', payload: '5' },
    },
    {
      label: 'Fafafa',
      type: 'Button',
      payload: { cmd: 'fx', payload: '6' },
    },
  ],
  [
    {
      label: 'Transition Speed',
      type: 'Slider',
      field: 'spd',
      payload: '{ "cmd": "fx", "payload": "$1" }',
      min: '0',
      max: '100',
    },
    {
      label: 'Brightness',
      type: 'Slider',
      field: 'br',
      payload: '{ "cmd": "fx", "payload": "$1" }',
      transform: (v) => (1 + (100 - v)),
      min: '0',
      max: '100',
    },
  ],
];
