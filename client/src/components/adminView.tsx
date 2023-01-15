import React, { useEffect, useState } from 'react';
// import DataBus from '../data';
import { Button, Container, InputGroup, Form } from 'react-bootstrap';
import { BsFilePlusFill } from 'react-icons/bs';


function SysInfo(props: any) {
  return (<Container>
    asd
  </Container>)
}

function RuleItem(props: any) {
  return (
    <div className='rule-item'>
      <div className='rule-row'>
        <label>name: </label>
        <input type="text" size={80}>{props.name}</input>
      </div>
      <div className='rule-row'>
        <span>
          <label>minute: </label>
          <input type="text" size={4}>{props.name}</input>
        </span>
        <span>
          <label>hour: </label>
          <input type="text" size={4}>{props.name}</input>
        </span>
        <span>
          <label>day of month: </label>
          <input type="text" size={4}>{props.name}</input>
        </span>
        <span>
          <label>day of week: </label>
          <input type="text" size={4}>{props.name}</input>
        </span>
      </div>
      <div className='separator'></div>
      <div className='actions-title'>
        <h4>actions</h4>
        <span className="clickable" onClick={() => console.log('hey')}><BsFilePlusFill /></span>
      </div>
      <div className='rule-row'>
        <label>topic</label>
        <input type="text" size={36}>{props.name}</input>

        <label>payload</label>
        <input type="text" size={36}>{props.name}</input>
      </div>

      <div className="rule-action-btns">
        <Button size="sm" variant="outline-success" onClick={async () => {
          // const t = await DataBus.emit('SCHEDULER_LIST', null, true);
          // console.dir(t);
        }}>Save</Button>
      </div>
    </div>
  )
}


function Rules(props: any) {
  let [rules, setRules] = useState([]);

  // useEffect(() => {
  //   DataBus.on('SCHEDULER_LIST', console.log);
  //   return () => DataBus.off('DEVICES_SCAN', console.log);

  // }, []);

  const ruleList = [<RuleItem></RuleItem>, ...rules.map(r => <RuleItem></RuleItem>)];

  return (
    <div>
      {ruleList}
    </div>
  )

}

export default function AdminView(props: any) {
  let [isScanning, setScan] = useState(false);
  // useEffect(() => {
  //   DataBus.on('DEVICES_SCAN', console.log);

  //   return () => DataBus.off('DEVICES_SCAN', console.log);
  // }, []);

  return (
    <div className="widget">
      <div className="AdminWidget">
        <h2>Administration</h2>
        <Button variant="outline-info" size="lg" onClick={() => 0/*DataBus.emit('DEVICES_SCAN', {})*/}>
          Scan for devices
        </Button>
      </div>
      <div className="RulesWidget">
        <h2>Scheduled rules: </h2>
        <Rules></Rules>
      </div>
    </div >
  );
}

