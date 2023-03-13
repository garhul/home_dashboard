import { useState } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

export type CMDRangeProps = {
  min: string;
  max: string;
  label: string;
  val: number;
  update: (data: string) => void;
}

export default function CMDRange(props: CMDRangeProps) {
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