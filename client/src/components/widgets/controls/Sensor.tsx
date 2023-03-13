import { timeSeriesSubset, timeSeriesSubsetKey } from "@backend/types";
import { useState } from "react";
import { Row, Col, Badge, Container, ButtonGroup, Button } from "react-bootstrap";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { WiThermometer, WiHumidity, WiBarometer, WiLightning, WiAlien } from "react-icons/wi";
import ElapsedTimeBadge from "./ElapsedTimeBadge";
import Plot from "./Plot";
export type SensorPropType = {
  channels: [
    { icon: string, key: string, color: string, unit: string }
  ];
  data: { key: string, series: timeSeriesSubset[] }[];
  lastSeen: number;
}

export type SensorChannelPropType = {
  channelSeries: timeSeriesSubset;
  channelKey : string;
  icon: string;
  unit: string;
  color: string;
}

type PlotButtonRowPropType = {
  setDomain: (string) => void;
  domain:timeSeriesSubsetKey;
}

function getIcon(icon: string) {
  switch (icon) {
    case 'TEMP':
      return <WiThermometer style={{ "fontSize": "5vh" }} />

    case 'HUMID':
      return <WiHumidity style={{ "fontSize": "5vh" }} />

    case 'PRES':
      return <WiBarometer style={{ "fontSize": "5vh" }} />

    case 'BAT':
      return <WiLightning style={{ "fontSize": "5vh" }} />

    default:
      return <WiAlien style={{ "fontSize": "5vh" }} />
  }
}

function SensorChannel(props: SensorChannelPropType) {
  const aggregatedData = props.channelSeries.extras;
  const plotData = props.channelSeries.series.map(datapoint => ({t: datapoint[0] * 1000, v: datapoint[1] / 1000}));
  
  return (
    <Row className="sensor_row" key={`chann_${props.channelKey}`}>     
      <Row>        
        <Col xs="auto">
          <h2>{getIcon(props.icon)} {(aggregatedData.last / 1000).toFixed(2)} <small>{props.unit}</small></h2>
        </Col>
        <Col xs="auto">          
          <Row>
            <Col><FiArrowUp style={{ "fontSize": "2vh" }}/></Col>
            <Col>
              <Badge bg="dark" style={{ "fontSize": "1.5vh" }}>{(aggregatedData.max / 1000).toFixed(2)}</Badge>
            </Col>
          </Row>
          <Row>
            <Col><FiArrowDown style={{ "fontSize": "2vh" }} /></Col>
            <Col>
              <Badge bg="dark" style={{ "fontSize": "1.5vh" }}>{(aggregatedData.min / 1000).toFixed(2)}</Badge>
            </Col>
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

export function PlotButtonRow(props: PlotButtonRowPropType) {  
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

export default function Sensor(props: SensorPropType) {  
  const [domain, setDomain] = useState<timeSeriesSubsetKey>('Immediate');  
  
  const channels = props.channels.map(chan => (<SensorChannel key={`sensor_${chan.key}`}
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
      <ElapsedTimeBadge lastSeen={props.lastSeen} />
    </Container>
  )
}