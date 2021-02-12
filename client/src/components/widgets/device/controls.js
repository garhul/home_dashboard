import React, {useState} from 'react';
import Button from 'react-bootstrap/Button'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { Basic } from 'react-dial-knob'
import Badge from 'react-bootstrap/Badge'
import { Line } from 'react-chartjs-2'
import { Row, Col } from 'react-bootstrap';


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

export function CMDLabel (props) {
  return <Badge variant="warning" style={{color:props.color}}>{props.label}</Badge>  
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