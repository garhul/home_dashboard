import React, { useState } from "react";
import { Button, Row } from "react-bootstrap";
import { AiOutlineLink, AiOutlineReload } from "react-icons/ai";
import useStore from '../../store/';
import AdminWidget from "./adminWidget";
import SimpleTable from './controls/SimpleTable';

export default function DevicesWidget() {
  const [scanning, setScanning] = useState(false);
  const store = useStore((state) => state);

  const tblCols = ['Id', 'Name', 'address', 'topic'];
  const tblRows = [
    ...store.devices.map(d => [d.device_id, d.human_name, (<a href={d.ip} rel="noopener noreferrer" target="_blank">{d.ip} <AiOutlineLink /></a>), d.topic]),
    ...store.sensors.map(s => [s.id, s.name, 'N/A', 'sensors'])];

  return (
    <AdminWidget title="Devices" actions={
      <Button disabled={scanning} onClick={() => setScanning(true)} size="sm">
        <AiOutlineReload style={(scanning) ? { animation: "spin 1.5s linear infinite" } : {}} />
        {(scanning) ? ' Scanning' : ' Scan'}
      </Button>
    }>
      <Row>
        <SimpleTable rows={tblRows} cols={tblCols} />
      </Row>
    </AdminWidget>
  )
}