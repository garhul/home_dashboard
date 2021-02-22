import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Basic } from 'react-dial-knob';
import Badge from 'react-bootstrap/Badge';
// import { Line } from 'react-chartjs-2';
import { Row, Col } from 'react-bootstrap';
import { Adjust, Speed, WbSunnyOutlined, WavesOutlined, BatteryAlert, ArrowDownward, ArrowUpward } from '@material-ui/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export function CMDButton(props) {
  function clickHandler() {
    props.update({data: null, payload: props.payload});
  }
  return (
    <Button block="true" variant={(!props.style)? "outline-info": props.style} size="lg" onClick={() => clickHandler()}>
      {props.label}
    </Button>)
}

export class CMDSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 0 };
  }

  clickHandler(ev) {
    ev.preventDefault();

    console.log(ev.currentTarget.offsetLeft);
    console.log(ev.clientX);
    console.log(ev.currentTarget.offsetWidth);

    const percentil = (ev.clientX - ev.currentTarget.offsetLeft) / ev.currentTarget.offsetWidth;
    // console.log(`${percentil * 100} %`);
    this.setState({ value: Math.floor(percentil * 100)});

    console.log(this.state);
    this.props.update({data: this.state.value, payload: this.props.payload});
  }

  render() {
    return <div className="sliderContainer" onClick={(ev) => this.clickHandler(ev)}>
      <span>{this.props.label}</span>

      <ProgressBar striped variant="dark" now={this.state.value} />
    </div>
  }
}

export function CMDKnob (props) {
  const [value, setValue] = useState(10);

  function update(val) {
    setValue(val);
    props.update({data: val, payload: props.payload});
  
  }
  return <Basic
      diameter={props.diameter ? props.diameter : 120}
      min={props.min}
      max={props.max}
      step={1}
      value={value}
      theme={{donutColor: '#17a2b8', centerColor:'#343a40',bgrColor:'#343a40',centerFocusedColor:'#343a40'}}
      onValueChange={(val) => update(val)}
  >
      <label>{props.label}</label>
  </Basic>
}

export function CMDSensorCard (props) {
  return <div className="sensorBox">
    <div class="row">
      <div class="col"></div>
    </div>
  </div>
}

export function CMDLabel (props) {
  return (
    <Row className="">
      <Col><BatteryAlert style={{"font-size":"4em"}} /> </Col>
      <Col>
        <Row>23 c</Row>
        <Row>
          <Col> <ArrowDownward/> 10 </Col>
          <Col> <ArrowUpward/> 33 </Col>
        </Row>
      </Col>
    </Row>
  )
  // return <Badge variant="warning" style={{color:props.color}}>{props.label}</Badge>  
}

export function Plot(props) {
  const [showScale, setShowScale] = useState(false);
  const [subset, setSubset] = useState('D');

  const options = {     
    maintainAspectRatio:true,
    scales: {
      yAxes: props.plots.map(plot => ({        
        ticks: {
          callback: (value, index, values) => `${value} ${plot.unit}`,
          maxTicksLimit: 5,
          fontColor: plot.color,
          suggestedMin: plot.min ?? 0,
          suggestedMax: plot.max ?? 100,          
        },       
        type: 'linear',
        display: showScale,
        id: `axis-${plot.key}`,


      })),
      xAxes: [{
        type: 'time',
        distribution: 'linear',        
        time: {
          unit: 'minute'
        },
        drawTicks:false
      }],
    }
  };  
  const data = {
    datasets: props.plots.map(plot => ({
      label: plot.label,
      borderColor: plot.color,
      fill: false,
      data:props.data[subset].data.map(p => ({ t:p.t, y: p.v[plot.key] })),  
      yAxisID: `axis-${plot.key}`,      
    }))
  };

  return (
    <div>
      <Line data={data} options={options} />
      <Row>
        <Col>
        <Button variant={(showScale)? 'outline-success':'outline-secondary'} onClick={() => {setShowScale(!showScale)}} size="sm">scale</Button>
        </Col>
        <Col>
          <Button variant={(subset === 'Y')? 'outline-success':'outline-secondary'} onClick={() => {setSubset('Y')}} size="sm">Year</Button>
        </Col>
        <Col>
          <Button variant={(subset === 'M')? 'outline-success':'outline-secondary'} onClick={() => {setSubset('M')}} size="sm">Month</Button>
        </Col>
        <Col>
          <Button variant={(subset === 'W')? 'outline-success':'outline-secondary'} onClick={() => {setSubset('W')}} size="sm">Week</Button>
        </Col>
        <Col>
          <Button variant={(subset === 'D')? 'outline-success':'outline-secondary'} onClick={() => {setSubset('D')}} size="sm">Day</Button>
        </Col>
      </Row>      
    </div>
  )
}

// export function SensorChannel(props) {
//   return 
// }
function getIcon(icon) {
  switch(icon) {
    case 'TEMP':
      return  <WbSunnyOutlined style={{"fontSize":"5vh"}}/>

    case 'HUMID':
      return <WavesOutlined style={{"fontSize":"5vh"}}/>

    case 'PRES':
      return <Speed style={{"fontSize":"5vh"}}/>
    
    case 'BAT':
      return <BatteryAlert style={{"fontSize":"5vh"}}/>

    default:
      return <Adjust style={{"fontSize":"5vh"}}/>
  }
}

function timeSince(t) {
  const min = 60;
  const hour = 3600;
  const day = 86400;
  const week = 604800;

 
  if (t < min) {
    return `${t}s`;
  }

  if (t < hour) {
    return `${Math.floor(t / 60)}m`;
  }

  if (t < day) {
    return `${Math.floor(t / hour)}h`; 
  }

  if (t < week) {
    return `${Math.floor(t/ day)}d`;
  }

  return `${Math.floor(t/ week)}w`;
}

function tinyPlot(props) {  
    const labelFn = (l) => {
      const d = new Date(l);
      return `${d.toLocaleDateString('en-GB')}:${d.toLocaleTimeString('en-GB')}`;
    }

    return (
      <ResponsiveContainer height={100} >
        <LineChart width={600} height={100} data={props.data}>
          <Line dot={false} type="monotone" dataKey="v" stroke={props.color} strokeWidth={2} margin={{ top: 0, right: 0, bottom: 0, left: 0}}/>
          <CartesianGrid stroke="#888" strokeDasharray="4" horizontal={false}/>
          <YAxis width={45}/>          
          <Tooltip separator="" labelFormatter={labelFn} formatter={(v,n,p)=>[`${parseFloat(v).toFixed(2)}${props.unit}`,'']} contentStyle={{"backgroundColor":"#222","border":"0"}} />          
          <XAxis hide={true} dataKey="t" tick={false}/>
        </LineChart>      
      </ResponsiveContainer>
    );  
}

export function Sensor(props) {
  const [showPlot, setShowPlot] = useState(false);
  const [subset, setSubset] = useState('D');

  function togglePlot() {
    setShowPlot(!showPlot);
  }
  const buttons = (
    <Col>
    <ButtonGroup aria-label="timescales">
      <Button variant={(showPlot)? 'outline-warning':'outline-secondary'} onClick={() => {togglePlot()}}>Plot</Button>
      <Button variant={(subset === 'Y')? 'outline-success':'outline-secondary'} onClick={() => {setSubset('Y')}} >last Year</Button>
      <Button variant={(subset === 'M')? 'outline-success':'outline-secondary'} onClick={() => {setSubset('M')}} >last 30d</Button>
      <Button variant={(subset === 'W')? 'outline-success':'outline-secondary'} onClick={() => {setSubset('W')}} >last 7d</Button>
      <Button variant={(subset === 'D')? 'outline-success':'outline-secondary'} onClick={() => {setSubset('D')}} >last 24h</Button>
    </ButtonGroup>
    </Col>
  )

  const channels = props.channels.map(chan => {
    return (
    <Row className="sensor_row" key={`chann_${chan.key}`}>
      <Col>
      <Row>
        <Col xs="auto" style={{"alignSelf":"center"}}>{getIcon(chan.icon)}</Col>
        <Col xs="6" style={{"alignSelf":"center","fontSize":"4vh"}}>
          {parseFloat(props.data[subset].keys[chan.key].last).toFixed(2)}
          <small>{chan.unit}</small>
        </Col>
        <Col xs="2" style={{"fontSize":"2.6vh"}}>
          <Row>
            <Col><ArrowUpward/></Col>
            <Col>{parseFloat(props.data[subset].keys[chan.key].max).toFixed(2)}</Col>
          </Row>
          <Row>
            <Col><ArrowDownward/></Col>
            <Col>{parseFloat(props.data[subset].keys[chan.key].min).toFixed(2)}</Col>
          </Row>
        </Col>
      </Row>

      {showPlot ?
      (<Row>
        <Col style={{"color":chan.color}}>{tinyPlot({
          ...chan,
          min: props.data[subset].keys[chan.key].min,
          max: props.data[subset].keys[chan.key].max,          
          data: props.data[subset].data.map(d => ({t: d.t, v: d.v[chan.key]}))
        })}
        </Col>
      </Row>) : '' }
      
      </Col>
    </Row>)});

    const lastSeen = Math.floor((Date.now() - props.data["I"].data[props.data["I"].data.length -1].t) / 1000);

  return (
    <div>
      <Row><Col>
        {channels}
        </Col>
        </Row>
        <Row style={{"marginTop":".4em"}}>{buttons}</Row>
        <Row style={{"marginTop":".4em","paddingRight":".4em"}}>
          <Col>
            { 
              (props.state.status !== 'OPERATIVE')
              ? (<Badge variant="danger"><BatteryAlert /> Battery critical</Badge>): ''
            }
          </Col>
          <Col style={{"textAlign":"right"}}>
            <Badge variant={(lastSeen < 3600)? 'dark' : 'danger'}>{timeSince(lastSeen)} ago</Badge>
          </Col>
        </Row>       
    </div>
  )
}


