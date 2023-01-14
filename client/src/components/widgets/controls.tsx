import React, { useState } from 'react';
import { Badge, Button, ButtonGroup, ProgressBar, Container, Row, Col, Alert } from 'react-bootstrap';
import { FiAirplay, FiBattery, FiWind, FiSun, FiArrowDown, FiArrowUp, FiCompass } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
// import DataBus from '../../data';
import { deviceStateData } from '@backend/types';

function CMDButton(props) {  
  return (
    <Button 
      variant={(!props.style) ? "outline-info" : props.style}
      size="lg"
      onClick={() =>  props.update(null)}
      >
      {props.label}
    </Button>)
}

function CMDSlider(props) {
  let [value, setValue] = useState(0);

  function clickHandler(ev) {
    ev.preventDefault();
    const percentil = (ev.clientX - ev.currentTarget.offsetLeft) / ev.currentTarget.offsetWidth;
    // console.log(`${percentil * 100} %`);
    setValue(Math.floor(percentil * 100));
    props.update(`${value}`);
  }

  return (
    <div className="sliderContainer" onClick={(ev) => clickHandler(ev)}>
      <span>{props.label}</span>
      <ProgressBar striped variant="dark" now={value} />
    </div>
  );
}

function CMDRange(props) {
  const [value, setValue] = useState(props.val || 0);

  return (
    <div>
      <div>
        {props.label}
      </div>
      <RangeSlider
        value={value}
        size='lg'
        variant='dark'
        onChange={changeEvent => setValue(changeEvent.target.value)}
        onAfterChange={ev => props.update(`${ev.target.value}`)}
      />
    </div >)
}

function Plot(props) {
  const [showScale, setShowScale] = useState(false);
  const [subset, setSubset] = useState('D');

  const options = {
    maintainAspectRatio: true,
    scales: {
      yAxes: props.plots.map(plot => ({
        ticks: {
          callback: (value, index, values) => `${value} ${plot.unit}`,
          maxTicksLimit: 5,
          fontColor: plot.color,
          suggestedMin: 900, //plot.min ?? 0,
          suggestedMax: 1000//plot.max ?? 100,
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
        drawTicks: false
      }],
    }
  };
  const data = {
    datasets: props.plots.map(plot => ({
      label: plot.label,
      borderColor: plot.color,
      fill: false,
      data: props.data[subset].data.map(p => ({ t: p.t, y: p.v[plot.key] })),
      yAxisID: `axis-${plot.key}`,
    }))
  };

  return (
    <div>
      <Line data={data} {...options} />
      <Row>
        <Col>
          <Button variant={(showScale) ? 'outline-success' : 'outline-secondary'} onClick={() => { setShowScale(!showScale) }} size="sm">scale</Button>
        </Col>
        <Col>
          <Button variant={(subset === 'Y') ? 'outline-success' : 'outline-secondary'} onClick={() => { setSubset('Y') }} size="sm">Year</Button>
        </Col>
        <Col>
          <Button variant={(subset === 'M') ? 'outline-success' : 'outline-secondary'} onClick={() => { setSubset('M') }} size="sm">Month</Button>
        </Col>
        <Col>
          <Button variant={(subset === 'W') ? 'outline-success' : 'outline-secondary'} onClick={() => { setSubset('W') }} size="sm">Week</Button>
        </Col>
        <Col>
          <Button variant={(subset === 'D') ? 'outline-success' : 'outline-secondary'} onClick={() => { setSubset('D') }} size="sm">Day</Button>
        </Col>
      </Row>
    </div>
  )
}

function getIcon(icon) {
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
    return `${Math.floor(t / day)}d`;
  }

  return `${Math.floor(t / week)}w`;
}

function tinyPlot(props) {

  function tickFormatter(tick) {
    const d = new Date(tick);
    return `${d.getDay()}.${d.getMonth()} ${d.getHours()}:${d.getMinutes()}`
  }

  const labelFn = (l) => {
    const d = new Date(l);
    return `${d.toLocaleDateString('en-GB')}:${d.toLocaleTimeString('en-GB')}`;
  }

  return (
    <ResponsiveContainer height={100} >
      <LineChart width={600} height={100} data={props.data}>
        <Line dot={false} type="monotone" dataKey="v" stroke={props.color} strokeWidth={2}  />
        <CartesianGrid stroke="#333" strokeDasharray="4" horizontal={true} />
        <YAxis width={45} domain={[Math.floor(props.min), Math.ceil(props.max)]} style={{ "fontSize": ".8em" }} />
        <Tooltip separator="" labelFormatter={labelFn} formatter={(v, n, p) => [`${parseFloat(v.toString()).toFixed(2)}${props.unit}`, '']} contentStyle={{ "backgroundColor": "#222", "border": "0" }} />
        <XAxis hide={false} interval={Math.ceil(props.data.length / 10)} dataKey="t" tick={true} tickFormatter={tickFormatter} style={{ "fontSize": ".8em" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function Sensor(props) {
  const [showPlot, setShowPlot] = useState(false);
  const [subset, setSubset] = useState('D');

  function togglePlot() {
    setShowPlot(!showPlot);
  }
  const buttons = (
    <Col>
      <ButtonGroup aria-label="timescales">
        <Button variant={(showPlot) ? 'outline-warning' : 'outline-secondary'} onClick={() => { togglePlot() }}>Plot</Button>
        <Button variant={(subset === 'Y') ? 'outline-success' : 'outline-secondary'} onClick={() => { setSubset('Y') }} >last Year</Button>
        <Button variant={(subset === 'M') ? 'outline-success' : 'outline-secondary'} onClick={() => { setSubset('M') }} >last 30d</Button>
        <Button variant={(subset === 'W') ? 'outline-success' : 'outline-secondary'} onClick={() => { setSubset('W') }} >last 7d</Button>
        <Button variant={(subset === 'D') ? 'outline-success' : 'outline-secondary'} onClick={() => { setSubset('D') }} >last 24h</Button>
      </ButtonGroup>
    </Col>
  )

  const channels = props.channels.map(chan => {
    return (
      <Row className="sensor_row" key={`chann_${chan.key}`}>
        <Col>
          <Row>
            <Col xs="auto" style={{ "alignSelf": "center" }}>{getIcon(chan.icon)}</Col>
            <Col xs="6" style={{ "alignSelf": "center", "fontSize": "4vh" }}>
              {parseFloat(props.data[subset].keys[chan.key].last).toFixed(2)}
              <small>{chan.unit}</small>
            </Col>
            <Col xs="2" style={{ "fontSize": "2.6vh" }}>
              <Row>
                <Col><FiArrowUp /></Col>
                <Col>{parseFloat(props.data[subset].keys[chan.key].max).toFixed(2)}</Col>
              </Row>
              <Row>
                <Col><FiArrowDown /></Col>
                <Col>{parseFloat(props.data[subset].keys[chan.key].min).toFixed(2)}</Col>
              </Row>
            </Col>
          </Row>

          {showPlot ?
            (<Row>
              <Col style={{ "color": chan.color }}>{tinyPlot({
                ...chan,
                min: props.data[subset].keys[chan.key].min,
                max: props.data[subset].keys[chan.key].max,
                data: props.data[subset].data.map(d => ({ t: d.t, v: d.v[chan.key] }))
              })}
              </Col>
            </Row>) : ''}

        </Col>
      </Row>)
  });

  const lastSeen = Math.floor((Date.now() - props.data["I"].data[props.data["I"].data.length - 1].t) / 1000);

  return (
    <div>
      <Row><Col>
        {channels}
      </Col>
      </Row>
      <Row style={{ "marginTop": ".4em" }}>{buttons}</Row>
      <Row style={{ "marginTop": ".4em", "paddingRight": ".4em" }}>
        <Col>
          {
            (props.state.status !== 'OPERATIVE')
              ? (<Badge bg="danger"><FiBattery /> Battery critical</Badge>) : ''
          }
        </Col>
        <Col style={{ "textAlign": "right" }}>
          <Badge bg={(lastSeen < 3600) ? 'dark' : 'danger'}>{timeSince(lastSeen)} ago</Badge>
        </Col>
      </Row>
    </div>
  )
}

function CMDLabel(props) {
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
          const ctrl = parseControls(props.state, rawCtrl);
          switch (ctrl.type.toUpperCase()) {
            case 'BUTTON':
              return (
                <Col key={`btn_${index}`}>
                  <CMDButton update={(data) => props.update(ctrl.payload, data)} key={`btn_${index}`} {...ctrl}></CMDButton>
                </Col>);

            case 'SLIDER':
              return (
                <Col key={`slider_${index}`}>
                  <CMDSlider update={(data) => props.update(ctrl.payload, data)} key={`slider_${index}`} {...ctrl}></CMDSlider >
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

            case 'PLOT':
              return (
                <Col key={`plot_${index}`}>
                  <Plot {...ctrl}></Plot>
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
