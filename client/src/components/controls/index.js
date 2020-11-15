import React from 'react';
import Button from 'react-bootstrap/Button'
import ProgressBar from 'react-bootstrap/ProgressBar'

export class CMDButton extends React.Component {
  clickHandler() {
    console.log(`cmd: ${this.props.cmd} payload: ${this.props.payload}`);
    this.props.update({ cmd: this.props.cmd, payload: this.props.payload });
  }
  render() {
    return <Button variant="outline-info" size="lg" onClick={() => this.clickHandler()}>{this.props.label}</Button>
  }
}

export class CMDSliider extends React.Component {
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
    console.log(`${percentil * 100} %`);
    this.setState({ value: Math.floor(percentil * 100)});

    console.log(this.state);
    this.props.update({
      cmd: this.props.cmd,
      payload: ('transform' in this.props) ? this.props.transform(this.state.value).toString() : this.state.value.toString()
    });

  }

  render() {
    return <div className="sliderContainer" onClick={(ev) => this.clickHandler(ev)}>
      <span>{this.props.label}</span>

      <ProgressBar striped variant="dark" now={this.state.value} />
    </div>
  }
}