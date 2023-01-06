const colors = ['#007bff', '#e83e8c', '#28a745', '#ffc107'];

module.exports = [
  [
    {
      type: 'sensor',
      channels: [
        {
          icon: 'TEMP',
          key: 't',
          color: colors[0],
          unit: 'C'
        },
        {
          icon: 'HUMID',
          key: 'h',
          color: colors[1],
          unit: '%'
        },
        {
          icon: 'PRES',
          key: 'p',
          color: colors[2],
          unit: 'hPa'
        }
      ],
      data: ({data}) => data,
      state: ({state}) => state,
    }
  ],
  // [
  //   {
  //     tpe:'icon',
  //     icon:'termometer',
  //     color: colors[0]
  //   },
  //   {
  //     type: 'label',
  //     label: ({state}) => `T: ${state.t} C`,
  //     color: colors[0]
  //   },
  //   {
  //     type: 'label',
  //     label: ({state}) => `H: ${state.h} %`,
  //     color: colors[1]
  //   },
  //   {
  //     type: 'label',
  //     label: ({state}) => `P: ${state.p} hPa`,
  //     color: colors[2]
  //   },
  //   {
  //     type: 'label',
  //     label: 'Battery Critical!',
  //     color: colors[3],
  //     visible: true
  //   }
  // ],
  // [{    
  //   type: 'plot',
  //   data: (d) => d.data,
  //   options: {      
  //     scales: {
  //       xAxes: [{
  //         type: 'line', //'time',
  //         time: {
  //             unit: 'hour',
  //             stepSize:5,
  //             minUnit:'hour'
  //         }
  //       }]
  //     }
  //   },
  //   plots: [
  //     {
  //       label: 'Temperature',        
  //       unit: 'C',        
  //       color: colors[0],
  //       key: 't',
  //       min: 10,
  //       max: 30
  //     },
  //     {
  //       label: 'Humidity',
  //       unit: '%',
  //       color: colors[1],
  //       key: 'h',
  //       min: 0,
  //       max: 100
  //     },
  //     {
  //       label: 'Pressure',
  //       unit: 'hPa',
  //       color: colors[2],
  //       key: 'p',
  //       min: 800,
  //       max: 1400
  //     },
  //     {
  //       label: 'Battery',
  //       unit: 'V',
  //       color: colors[3],
  //       key: 'vbat',
  //       min: 0,
  //       max: 5
  //     }
  //   ]
  // }]
]