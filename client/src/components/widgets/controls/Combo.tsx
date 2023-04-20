import React, { useState } from "react";
import { Col, Row } from 'react-bootstrap';

export type ComboProperties = {
  onChange: (value: string) => void;
  options: [name: string, value: string][];
  initialValue?: string | null;
  showOther?: boolean;
  disabled?: boolean;
  value?: string;
}

export default function Combo({ onChange, value = '', disabled = false, showOther = true, options }: ComboProperties) {
  const [selectedOption, setSelectedOption] = useState(value);
  const [controlValue, setControlValue] = useState(value);

  const handleSelectionChange: React.ChangeEventHandler<HTMLSelectElement> = (ev): void => {
    ev.preventDefault();
    const val = ev.currentTarget.value;
    setSelectedOption(val);

    if (val !== '?') {
      onChange(val);
      setControlValue(val);
    }

  };

  const handleTextChange: React.ChangeEventHandler<HTMLInputElement> = (ev): void => {
    ev.preventDefault();
    const val = ev.currentTarget.value;
    onChange(val);
    setControlValue(val);
  }

  if (!options.find(o => o[1] === controlValue)) {
    if (selectedOption !== '?' && selectedOption !== '') setSelectedOption('?');
  }

  const opts = [['----', ''], ...options];
  if (showOther) opts.push(['Other', '?']);

  return (
    <Row>
      <Col>
        <Row>
          <select disabled={disabled} defaultValue={value} onChange={handleSelectionChange}>
            {opts.map(opt => <option key={opt[1]} value={opt[1]}>{opt[0]}</option>)}
          </select>
        </Row>
        <Row style={{ display: (selectedOption === '?') ? 'block' : 'none' }}>
          <input type="text" value={controlValue} onChange={handleTextChange} />
        </Row>
      </Col>
    </Row>
  )
}