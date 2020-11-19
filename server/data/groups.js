module.exports = [{
  id: '123f',
  name: 'Living lights',
  topics: ['living/desk-lamp', 'living/fafafa'],
  devices: ['0xf44', '50f3f'],
  controls: [
    [{
      label: 'Off',
      type: 'Button',
      payload: '{"cmd": "fx", payload: 3 }',
    }],
    [
      {
        label: 'Rainbow',
        type: 'Button',
        payload: '{"cmd": "fx", payload: 3 }',
      },
      {
        label: 'Aurora',
        type: 'Button',
        payload: '{"cmd": "fx", payload: 2 }',
      },
    ],
    [
      {
        label: 'Fire',
        type: 'Button',
        payload: '{"cmd": "fx", payload: 3 }',
      },
      {
        label: 'Chaser',
        type: 'Button',
        payload: '{"cmd": "fx", payload: 2 }',
      },
    ],
    [
      {
        label: 'Hue split',
        type: 'Button',
        payload: '{"cmd": "fx", payload: 3 }',
      },
      {
        label: 'Fafafa',
        type: 'Button',
        payload: '{"cmd": "fx", payload: 2 }',
      },
    ],
    [
      {
        label: 'Transition Speed',
        type: 'Slider',
        field: 'spd',
        payload: '{"cmd":"fx", "payload":$1}',
        min: '0',
        max: '100',
      },
      {
        label: 'Brightness',
        type: 'Slider',
        field: 'br',
        payload: '{"cmd":"fx", "payload":$1}',
        transform: (v) => (1 + (100 - v)),
        min: '0',
        max: '100',
      },
    ],
  ],
}];
