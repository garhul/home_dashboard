const colors = ['#007bff', '#e83e8c', '#28a745', '#ffc107'];

module.exports = [
  [
    {
      type: 'label',
      label: ({D}) => `T: ${(D.keys.t.last).toFixed(2)} C`,
      color: colors[0]
    },
    {
      type: 'label',
      label: ({D}) => `H: ${(D.keys.h.last).toFixed(2)} %`,
      color: colors[1]
    },
    {
      type: 'label',
      label: ({D}) => `P: ${(D.keys.p.last).toFixed(2)} hPa`,
      color: colors[2]
    },
    {
      type: 'label',
      label: ({D}) => `vBat: ${(D.keys.vbat.last).toFixed(2)} v`,
      color: colors[3]
    }
  ],
  [{    
    type: 'plot',
    data: (d) => d,
    options: {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
              unit: 'minute'
          }
        }]
      }
    },
    plots: [
      {
        label: 'Temperature',        
        unit: 'C',        
        color: colors[0],
        key: 't'
      },
      {
        label: 'Humidity',
        unit: '%',
        color: colors[1],
        key: 'h'
      },
      {
        label: 'Pressure',
        unit: 'hPa',
        color: colors[2],
        key: 'p'
      },
      {
        label: 'Battery',
        unit: 'V',
        color: colors[3],
        key: 'vbat'
      }
    ]
  }]
]