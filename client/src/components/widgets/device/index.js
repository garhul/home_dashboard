import React from 'react';
import DataBus from '../../../data';
import { CMDButton, Sensor, CMDSlider, CMDKnob, CMDLabel, Plot } from './controls';
import { Container, Row, Col } from 'react-bootstrap';

export default class DeviceControl extends React.Component {
  update({data, payload}) {
    DataBus.emit('WIDGETS_CMD',{
      id: this.props.id,   
      data,
      payload
    });
  }
  
  render() {
    const Controls = this.props.controls.map((row, i) => {
      return (
        <Row key={`row_${i}`}>
          {row.map((ctrl, index) => {
            if (!ctrl.type) return null;
            
            switch (ctrl.type.toUpperCase()) {
              case 'BUTTON':
                return (<Col  key={`btn_${index}`}>
                  <CMDButton update={(data) => this.update(data)} key={`btn_${index}`} {...ctrl}></CMDButton>
                  </Col>);

              case 'KNOB':
                return (
                  <Col  key={`knob_${index}`}>
                    <CMDSlider update={(data) => this.update(data)} key={`knob_${index}`} {...ctrl}></CMDSlider >
                  </Col>);

              case 'SLIDER': 
                return (
                  <Col  key={`slider_${index}`}>
                    <CMDKnob update={(data) => this.update(data)} key={`slider_${index}`} {...ctrl}></CMDKnob >
                  </Col>);

              case 'LABEL':
                return (
                  <Col key={`label_${index}`}>
                    <CMDLabel {...ctrl}></CMDLabel>
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
