module.exports = [
  [
    {
      type: 'label',
      label: ({t}) => `T: ${(t.series[t.series.length - 1][1]).toFixed(2)} C`
    },
    {
      type: 'label',
      label: ({h}) => `H: ${(h.series[h.series.length -1 ][1]).toFixed(2)} %`,
    },
    {
      type: 'label',
      label: ({p}) => `P: ${(p.series[p.series.length -1 ][1]).toFixed(2)} hPa`,
    }
  ],
  [{    
    type: 'plot',
    data: (d) => d,
    plots: [
      {
        label: 'Temperature',        
        unit: 'C',        
        color: '#ff6600',
        key: 't'
      },
      {
        label: 'Humidity',
        unit: '%',
        color: '#ff9900',
        key: 'h'
      },
      {
        label: 'Pressure',
        unit: 'hPa',
        color: '#00ff99',
        key: 'p'
      },
      {
        label: 'Battery',
        unit: 'V',
        color: '#00ff99',
        key: 'vbat'
      }
    ]
  }],
  [
    {
      label: 'Year',
      type: 'Button',
      style: ({range}) => ( range === 'Y' ) ? 'outline-success' : 'outline-secondary',
      payload: '{"blabla":"bleble"}',
    },
    {
      label: 'Month',
      type: 'Button',
      style: ({range}) => ( range === 'Y' ) ? 'outline-success' : 'outline-secondary',
      payload: '{"blabla":"bleble"}',
    },
    {
      label: 'Week',
      type: 'Button',
      style: ({range}) => ( range === 'Y' ) ? 'outline-success' : 'outline-secondary',
      payload: '{"blabla":"bleble"}',
    },
    {
      label: 'Day',
      type: 'Button',
      style: ({range}) => ( range === 'Y' ) ? 'outline-success' : 'outline-secondary',
      payload: '{"blabla":"bleble"}',
    },
  ]
]