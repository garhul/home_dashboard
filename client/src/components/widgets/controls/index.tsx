import { Container, Row, Col, Alert } from 'react-bootstrap';
import { deviceStateData, sensorData } from '@backend/types';
import CMDButton from './CMDButton';
import CMDRange from './CMDRange';
import CMDLabel from './CMDLabel';
import Sensor from './Sensor';
import { DeviceControlsList, GroupControlList, SensorCtrlTypeList } from './controlDefinitions';

function parseControls(state: deviceStateData | sensorData, control) {
  const parsed = {};

  Object.keys(control).forEach(key => {
    if (typeof control[key] === 'function') 
      parsed[key] = control[key].call(null, state);
  });

  return {...control, ...parsed};
}

type deviceControlPropsType =  {
  controls: DeviceControlsList | SensorCtrlTypeList | GroupControlList;
  state? : deviceStateData | sensorData;
  update?: (payload:string, data:null | string) => void;
}

export default function DeviceControl(props: deviceControlPropsType  ) {
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
