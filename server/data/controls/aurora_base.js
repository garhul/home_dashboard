module.exports = [
  [{
    label: 'Off',
    type: 'Button',
    style: 'outline-warning',
    payload: { cmd: 'off', payload: '' },
  }],
  [{
    label: ({mode}) => (mode === 2) ? 'Pause': 'Play',
    type: 'Button',
    style: ({mode}) => (mode === 2) ? 'outline-light' : 'outline-success',
    payload: ({mode}) => (mode === 2) ? { cmd: 'pause', payload: '' } : { cmd: 'play', payload: ''},
  }],
  [
    {
      label: 'Rainbow',
      type: 'Button',
      style: ({fx}) => (fx === 1 ) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '1' },
    },
    {
      label: 'Opposites',
      type: 'Button',
      style: ({fx}) => (fx === 4 ) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '4' },
    },
  ],
  [
    {
      label: 'Wavebow',
      type: 'Button',
      style: ({fx}) => (fx === 2 ) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '2' },
    },
    {
      label: 'Chaser',
      type: 'Button',
      style: ({fx}) => (fx === 6 ) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '6' },
    },
  ],
  [
    {
      label: 'Hue split',
      type: 'Button',
      style: ({fx}) => (fx === 5 ) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '5' },
    },
    {
      label: 'White aurora',
      type: 'Button',
      style: ({fx}) => (fx === 7 ) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '7' },
    },
  ],
  [
    {
      label: 'Aurora',
      type: 'Button',
      style: ({fx}) => (fx === 3 ) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '3' },
    },
    {
      label: 'White chaser',
      type: 'Button',
      style: ({fx}) => (fx === 8 ) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '8' },
    },
  ],
  [
    {
      label: 'Trippy',
      type: 'Button',
      style: ({fx}) => (fx === 9 ) ? 'outline-success' : 'outline-secondary',
      payload: { cmd: 'fx', payload: '9' },
    },
    {}
  ],
  [
    {
      label: 'Transition Speed',
      type: 'Knob',
      payload: '{"cmd":"spd", "payload":$1}',
      min: '0',
      max: '100',
      val: ({spd}) => spd
    },
  ],
  [
    {
      label: 'Brightness',
      type: 'Knob',
      payload: '{"cmd":"br", "payload":$1}',
      min: '0',
      max: '100',
      val : ({br}) => br
    },
  ],
];
