import React from 'react';
import DataBus from '../../../data';
import { CMDButton, CMDSlider, CMDKnob } from './controls';
import { Container, Row, Col } from 'react-bootstrap';

export default class DeviceControl extends React.Component {
  update({data, payload, topics = null}) {
    if (topics === null) {
      topics = this.props.topics || [this.props.topic];
    }
    
    DataBus.emit('devices.cmd',{
      topics,
      data,
      payload
    });
  }
  
  render() {
    const Controls = this.props.controls.map((row, i) => {
      return (
        <Row key={`row_${i}`}>
          {row.map((ctrl, index) => {
            switch (ctrl.type.toUpperCase()) {
              case 'BUTTON':
                return (<Col  key={`btn_${index}`}>
                  <CMDButton update={(data) => this.update(data)} key={`btn_${index}`} {...ctrl}></CMDButton>
                  </Col>);

              case 'KNOB':
                return (
                  <Col  key={`slider_${index}`}>
                    <CMDSlider update={(data) => this.update(data)} key={`slider_${index}`} {...ctrl}></CMDSlider >
                  </Col>);

              case 'SLIDER': 
                return (
                  <Col  key={`slider_${index}`}>
                    <CMDKnob update={(data) => this.update(data)} key={`knob_${index}`} {...ctrl}></CMDKnob >
                  </Col>);
              default: 
                return null;
            }
          })}
        </Row>
      )
    });

    return <Container id="DeviceControl">
        {Controls}
        </Container>      
  }
}
