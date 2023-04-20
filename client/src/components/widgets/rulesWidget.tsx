
import React, { useEffect, useState } from 'react';
import Combo from './controls/Combo';
import { RuleData } from '@backend/types';
import { Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import useStore from '../../store';
import AdminWidget from '../widgets/adminWidget';
import SimpleTable from './controls/SimpleTable';


type RuelAddModalProps = {
  onClose: () => void;
  onAdd: (data: RuleData) => void;
  show: boolean;
}

type ruleRecord = {
  name: string,
  min: string,
  hr: string,
  day: string,
  month: string,
  weekDay: string,
  actions: []
}

function RuleAddModal(props: RuelAddModalProps) {
  const [data, setData] = useState<Record<string, string | []>>(null);
  const devices = useStore((state) => state.devices);

  // const [actionList, setActionList] = useState([]);
  const topicOpts: [string, string][] = [
    ['All', '*'],
    ...devices.map((d): [string, string] => [d.human_name, d.topic]),
  ];

  const actionOpts: [string, string][] = [
    ['Off', '{"cmd":"off", "payload":""}'],
    ['Red', '{"cmd":"setRGB", "payload:"0xff"}']
  ];

  const updateData = (key, value) => {
    const newData = { ...data, ...Object.fromEntries([[key, value]]) };
    console.log(newData);
    setData(newData);
  }

  const handleSave = () => {
    console.log(data);
    //TODO:: perform rudimentary validation
    // const ruleData: RuleData = {
    //   name: data.name,
    //   actions: data.actions

    // }
    // props.onAdd(data);
  }
  const handleClose = () => props.onClose()

  return (
    <Modal
      show={props.show}
      onHide={props.onClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>Add rule</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RuleEdit onChange={updateData} actionOpts={actionOpts} topicOpts={topicOpts} data={data as ruleRecord} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>Close</Button>
        <Button variant="outline-primary" onClick={handleSave}>Save Changes</Button>
      </Modal.Footer>
    </Modal >
  )
}


type actionItem = {
  topic: string;
  payload: string;
}

function RuleActionsList({ topicOpts, actionOpts, actions, onChange }) {
  const [actionList, setActionList] = useState<actionItem[]>([]);

  useEffect(() => {
    const a = actions.length === 0 ? [...actions, { payload: '', topic: '' }] : actions;
    setActionList(a);
  }, [actions]);

  const handleActionChange = (key, value) => {
    const newActions = [...actionList];
    newActions[key] = { ...newActions[key], ...value };
    console.log(newActions);
    setActionList(newActions);
    onChange(newActions);
  }

  const actionComponents = actionList.map((item, key) =>
  (<Row key={`_${key}`} style={{ marginTop: "1em" }}>
    <Col xs={{ span: 5 }}>
      <Row><span className="text-sm">Topic:</span></Row>
      <Combo options={topicOpts} value={item.topic} onChange={(d) => { handleActionChange(key, { topic: d }) }} showOther={true} />
    </Col>
    <Col xs={{ span: 5, offset: 2 }}>
      <Row><span className="text-sm">Action:</span></Row>
      <Combo options={actionOpts} value={item.payload} onChange={(d) => { handleActionChange(key, { action: d }) }} showOther={true} />
    </Col>
  </Row>))


  return (
    <Container style={{ marginTop: "1em" }}>
      <Row>
        <Col>Actions</Col>
        <Col xs="1" style={{ textAlign: 'right' }}>
          <Button
            size="sm" variant="outline-success"
            onClick={() => setActionList([...actionList, { topic: '', payload: '' }])}><AiFillPlusCircle />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>{actionComponents}</Col>
      </Row>
    </Container>
  )
}


type RuleEditProps = {
  onChange: (key: string, value: string) => void;
  data: {
    name: string,
    min: string,
    hr: string,
    day: string,
    month: string,
    weekDay: string,
    actions: []
  },
  topicOpts,
  actionOpts,
}

function RuleEdit({ actionOpts, topicOpts, data, onChange }: RuleEditProps) {
  return (
    <Container className="rule" style={{ padding: "1em" }}>
      <Row>
        <Col xs={{ span: 5 }}>
          <Row style={{ paddingBottom: ".5em" }}><span>Name</span></Row>
          <Row>
            <input type="text" value={data?.name ?? ''} placeholder="rule name" onChange={(ev) => onChange('name', ev.target.value)} />
          </Row>
        </Col>
        <Col xs={{ span: 5, offset: 2 }}>
          <Row style={{ paddingBottom: ".5em" }}><span>Schedule: <small>(use cron format)</small></span></Row>
          <Row>
            <Col style={{ gap: "1em", display: 'flex' }}>
              <input type="text" placeholder="m" value={data?.min ?? '*'} size={4} maxLength={2} onChange={(ev) => onChange('min', ev.target.value)} />
              <input type="text" placeholder="hour" value={data?.hr ?? '*'} size={4} maxLength={2} onChange={(ev) => onChange('hr', ev.target.value)} />
              <input type="text" placeholder="day" value={data?.day ?? '*'} size={4} maxLength={2} onChange={(ev) => onChange('day', ev.target.value)} />
              <input type="text" placeholder="Month" value={data?.month ?? '*'} size={4} maxLength={2} onChange={(ev) => onChange('month', ev.target.value)} />
              <input type="text" placeholder="w-day" value={data?.weekDay ?? '*'} size={4} maxLength={2} onChange={(ev) => onChange('weekDay', ev.target.value)} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <RuleActionsList topicOpts={topicOpts} actionOpts={actionOpts} actions={[]} onChange={(actions) => onChange('actions', actions)} />
      </Row>
    </Container>
  )
}

function Rule(props) {
  return (
    <div style={{ display: 'flex' }}>
      <div>{props.name}</div>
      <div>{props.schedule}</div>
    </div>
  )
}


function RulesList(props) {
  const rules = props.rules.map((s, i) => (<Rule {...s} key={`ruleList_${i}`} />));
  return (
    <Container>
      {rules}
    </Container>
  )
}


export default function Rules() {
  const [showAddModal, setShowAddModal] = useState(false);
  // const [showResult, setShowResult] = useState(null);
  const rules = useStore(st => st.rules);

  const addRuleHandler = (ruleData) => {
    console.log(ruleData);
  }

  // const tableRows = rules.map(rule => (

  // ));

  return (
    <AdminWidget title="Rules"
      actions={
        <Button onClick={() => setShowAddModal(true)}>Add Rule</Button>
      }>

      <Row>
        <RulesList rules={rules} />
        <SimpleTable
          cols={['name', 'min|hour|month|weekday', 'details', 'actions']}
          rows={[]}
        />
        <RuleAddModal
          show={showAddModal}
          onAdd={addRuleHandler}
          onClose={() => setShowAddModal(false)}
        />
      </Row>

    </AdminWidget>
  );
}