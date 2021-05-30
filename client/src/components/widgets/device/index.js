import React from 'react';
import DataBus from '../../../data';
import { CMDButton, Sensor, CMDSlider, CMDLabel, Plot, CMDRange } from './controls';
import { Container, Row, Col, Alert } from 'react-bootstrap';

export default class DeviceControl extends React.Component {
  update({ data, payload }) {
    DataBus.emit('WIDGETS_CMD', {
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
                return (<Col key={`btn_${index}`}>
                  <CMDButton update={(data) => this.update(data)} key={`btn_${index}`} {...ctrl}></CMDButton>
                </Col>);

              case 'SLIDER':
                return (
                  <Col key={`slider_${index}`}>
                    <CMDSlider update={(data) => this.update(data)} key={`slider_${index}`} {...ctrl}></CMDSlider >
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
                    <CMDRange update={(data) => this.update(data)} key={`rng_${index}`} {...ctrl}></CMDRange>
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

    return <Container id="DeviceControl">
      {Controls}
    </Container>
  }
}
