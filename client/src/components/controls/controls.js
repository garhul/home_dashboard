import React from 'react';
import Button from 'react-bootstrap/Button'
import ProgressBar from 'react-bootstrap/ProgressBar'

export const controls =
  [
    {
      type: "button",
      cmd: "fx",
      payload: "1",
      label: "Rainbow"
    },
    {
      type: "button",
      cmd: "fx",
      payload: "2",
      label: "Aurora"
    },
    {
      type: "button",
      cmd: "fx",
      payload: "3",
      label: "Rainbow"
    },
    {
      type: "button",
      cmd: "fx",
      payload: "4",
      label: "Rainbow"
    },
    {
      type: "button",
      cmd: "fx",
      payload: "5",
      label: "Rainbow"
    },
    {
      type: "button",
      cmd: "off",
      payload: null,
      label: "off"
    },
    {
      type: "slider", //TODO:: implement slider with logaritmic scale
      label: "brightness",
      cmd: "br",
      min: 0,
      max: 100
    },
    {
      type: "slider",
      cmd: "spd",
      label: "Speed",
      min: 0,
      max: 100,
      transform: (v) => (1 + (100 - v)),
    }
  ];


export class CMDButton extends React.Component {

  clickHandler() {
    console.log(`cmd: ${this.props.cmd} payload: ${this.props.payload}`);
    this.props.update({ cmd: this.props.cmd, payload: this.props.payload });
  }

  render() {
    return <Button variant="outline-dark" size="lg" onClick={() => this.clickHandler()}>{this.props.label}</Button>
  }

}

export class CMDSliider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 0 };
  }

  clickHandler(ev) {
    ev.preventDefault();
    const percentil = (ev.clientX - ev.currentTarget.offsetLeft) / ev.currentTarget.offsetWidth;
    console.log(`${percentil * 100} %`);
    this.setState({ value: (percentil * 100) });

    this.props.update({
      cmd: this.props.cmd, payload:
        ('transform' in this.props) ? this.props.transform(this.state.value) : this.state.value
    });

  }

  render() {
    return <div onClick={(ev) => this.clickHandler(ev)}>
      <span>{this.props.label}</span>

      <ProgressBar striped variant="dark" now={this.state.value} />
    </div>

  }


}