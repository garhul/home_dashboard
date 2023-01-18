import React, { useEffect, useState } from 'react';
import { Badge, Button, ButtonGroup, Container, Row, Col, Alert } from 'react-bootstrap';
import { FiAirplay, FiBattery, FiWind, FiSun, FiArrowDown, FiArrowUp, FiCompass } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { deviceStateData, timeSeriesSubset, timeSeriesSubsetKey } from '@backend/types';
import { CMDButtonPropType, CMDRangeProps, PlotPropType, SensorPropType, CMDLabelPropType } from './widgetTypes';

function CMDButton(props: CMDButtonPropType) {  
  return (
    <Button 
      variant={(!props.style) ? "outline-info" : props.style}
      size="lg"
      onClick={() =>  props.update(null)}
      >
      {props.label}
    </Button>)
}

function CMDRange(props: CMDRangeProps) {
  const [value, setValue] = useState(props.val || 0);

  return (
    <div>
      <div>
        {props.label}
      </div>
      <RangeSlider
        value={value}
        min={parseInt(props.min) || 0}
        max={parseInt(props.max) || 100}
        size='lg'
        variant='dark'
        onChange={changeEvent => setValue(parseInt(changeEvent.target.value))}
        onAfterChange={ev => props.update(`${ev.target.value}`)}
      />
    </div >)
}

function getIcon(icon: string) {
  switch (icon) {
    case 'TEMP':
      return <FiSun style={{ "fontSize": "5vh" }} />

    case 'HUMID':
      return <FiWind style={{ "fontSize": "5vh" }} />

    case 'PRES':
      return <FiCompass style={{ "fontSize": "5vh" }} />

    case 'BAT':
      return <FiBattery style={{ "fontSize": "5vh" }} />

    default:
      return <FiAirplay style={{ "fontSize": "5vh" }} />
  }
}

function timeSince(t:number) {    
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
    return `${Math.floor(t / day)}d`;
  }

  return `${Math.floor(t / week)}w`;
}

function Plot(props: PlotPropType) {

  function tickFormatter(tick:number) {
    const d = new Date(tick);
    return `${d.toLocaleDateString('en-GB',{ month: 'numeric', 'day':'2-digit'})} : ${d.toLocaleTimeString('en-GB', {timeStyle:"short"})}`;
  }

  const labelFn = (l:number) => {
    const d = new Date(l);
    return `${d.toLocaleDateString('en-GB', { month: 'numeric', 'day':'2-digit'})} : ${d.toLocaleTimeString('en-GB',{timeStyle:"short"})}`;
  }

  return (
    <Row>
    {/* <Col style={{ "color": props.color }}> */}
      <ResponsiveContainer height={180} >
        <LineChart width={600} height={180} data={props.data}>
          <Line dot={false} type="monotone" dataKey="v" stroke={props.color} strokeWidth={1}  />
          <CartesianGrid stroke="#666" strokeDasharray="8" horizontal={true} vertical={false} strokeWidth={.5} />
          <YAxis width={50}  style={{ "fontSize": ".8em" }} />
          <Tooltip separator="" labelFormatter={labelFn} formatter={(v, n, p) => [`${parseFloat(v.toString()).toFixed(2)}${props.unit}`, '']} contentStyle={{ "backgroundColor": "#222", "border": "0" }} />
          <XAxis hide={false} interval={Math.ceil(props.data.length / 5)} dataKey="t" tick={true} tickFormatter={tickFormatter} style={{ "fontSize": ".75em" }} />
        </LineChart>
      </ResponsiveContainer>
    </Row>
  );
}

type PlotButtonRowPropType = {
  setDomain: (string) => void;
  domain:timeSeriesSubsetKey;
}

function PlotButtonRow(props: PlotButtonRowPropType) {  
  const setSubset = props.setDomain;
  return (<Row className="plot-buttons">
    <ButtonGroup aria-label="timescales">      
      <Button variant={(props.domain === 'Year') ? 'outline-warning' : 'outline-secondary'} onClick={() => { setSubset('Year') }} >last Year</Button>
      <Button variant={(props.domain === 'Month') ? 'outline-warning' : 'outline-secondary'} onClick={() => { setSubset('Month') }} >last 30d</Button>
      <Button variant={(props.domain === 'Week') ? 'outline-warning' : 'outline-secondary'} onClick={() => { setSubset('Week') }} >last 7d</Button>
      <Button variant={(props.domain === 'Day') ? 'outline-warning' : 'outline-secondary'} onClick={() => { setSubset('Day') }} >last 24h</Button>
      <Button variant={(props.domain === 'Immediate') ? 'outline-warning' : 'outline-secondary'} onClick={() => { setSubset('Immediate') }} >instant</Button>
    </ButtonGroup>    
  </Row>);
}

type SensorChannelPropType = {
  channelSeries: timeSeriesSubset;
  channelKey : string;
  icon: string;
  unit: string;
  color: string;
}

function SensorChannel(props: SensorChannelPropType) {
  const aggregatedData = props.channelSeries.extras;
  const plotData = props.channelSeries.series.map(datapoint => ({t: datapoint[0] * 1000, v: datapoint[1] / 1000}));
  
  return (
    <Row className="sensor_row" key={`chann_${props.channelKey}`}>
      {/* <Col> */}
        <Row>
          <Col xs="auto">{getIcon(props.icon)}</Col>
          <Col xs="auto">
            <h2>{(aggregatedData.last / 1000).toFixed(2)} <small>{props.unit}</small></h2>
          </Col>
          <Col xs="auto">
            <Row>
              <Col><FiArrowUp /> <Badge bg="dark">{(aggregatedData.max / 1000).toFixed(2)}</Badge></Col>              
            </Row>
            <Row>
              <Col><FiArrowDown /> <Badge bg="dark">{(aggregatedData.min / 1000).toFixed(2)}</Badge></Col>                
            </Row>
          </Col>
        </Row>        
        <Plot 
          unit={props.unit}
          color={props.color}
          data={plotData}
          min={(aggregatedData.min / 1000)}
          max={(aggregatedData.max / 1000)}
          intervalWindow={props.channelSeries.timeWindow}
        />                
    </Row>)
}


function ElapsedTimeBadge(props) {
  const [ ,updateElapsed] = useState(0);
  const elapsedSeconds = Math.ceil((Date.now() - props.lastSeen) / 1000);

  useEffect(()=> {
    const interval = setInterval(() => updateElapsed(Date.now()), 10000);
    return () => {
      clearInterval(interval);
    };
  },[]);    
  return (
    <Badge bg={(elapsedSeconds < 3600) ? 'dark' : 'danger'}>{timeSince(elapsedSeconds)} ago</Badge>
  );
}

function Sensor(props: SensorPropType) {  
  const [domain, setDomain] = useState<timeSeriesSubsetKey>('Immediate');  
  
  const channels = props.channels.map(chan => (<SensorChannel 
    channelSeries = {props.data.find(subset => subset.key === chan.key).series.find(s => s.key === domain)}
    icon={chan.icon}
    channelKey={chan.key}
    unit={chan.unit}
    color={chan.color}
    ></SensorChannel>))

  return (
    <Container>
      {channels}
      <PlotButtonRow setDomain={(dom) => setDomain(dom) } domain={domain}/>
      <Row>
        <Col>
          <ElapsedTimeBadge lastSeen={props.lastSeen} />        
        </Col>
      </Row>
    </Container>
  )
}


function CMDLabel(props: CMDLabelPropType) {
  return (
    <Badge bg="primary">
      {props.label}
    </Badge>
  )
}


function parseControls(state: deviceStateData, control) {
  const parsed = {};

  Object.keys(control).forEach(key => {
    if (typeof control[key] === 'function') 
      parsed[key] = control[key].call(null, state);
  });

  return {...control, ...parsed};
}

export default function DeviceControl(props) {
  const Controls = props.controls.map((row, i :number) => {

    return (
      <Row key={`row_${i}`}>
        {row.map((rawCtrl, index) => {
          if (!rawCtrl.type) return null;
          const ctrl = (props.state) ? parseControls(props.state, rawCtrl) : rawCtrl;          
          switch (ctrl.type.toUpperCase()) {
            case 'BUTTON':
              return (
                <Col key={`btn_${index}`}>
                  <CMDButton update={(data) => props.update(ctrl.payload, data)} key={`btn_${index}`} {...ctrl}></CMDButton>
                </Col>);

            case 'LABEL':
              return (
                <Col key={`label_${index}`}>
                  <CMDLabel {...ctrl}></CMDLabel>
                </Col>
              )

            case 'RANGE':
              return (
                <Col key={`range_${index}`}>
                  <CMDRange update={(data) => props.update(ctrl.payload, data)} key={`rng_${index}`} {...ctrl}></CMDRange>
                </Col>
              )

            case 'SENSOR':
              return (
                <Col key={`sensor_${index}`}>
                  <Sensor {...ctrl}></Sensor>
                </Col>
              )

            default:
              return (<Alert key={`alert_${index}`} variant="warning">Control for {ctrl.type} not found!</Alert>);
          }
        })}
      </Row>
    )
  });

  return (
    <Container>
      {Controls}
    </Container>
  );
}
