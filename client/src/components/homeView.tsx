import React from 'react';
// import Widgets from './widgets';
import { Container } from 'react-bootstrap';
import useStore from '../store';
import { GroupCtrl } from './controlDefinitions';
import { Widget } from './widgets';
import { expandedGroupData } from '@backend/types';

function QuickInfo() {
  return (
    <Container className="QuickInfo">
      Temp, etc
    </Container>
  )
}

export default function HomeView() {
  const store = useStore((store) => store);    

  const expandedGroups: expandedGroupData[] = store.groups.map(group => {
    return {
      id: group.id,
      name: group.name,
      deviceIds: group.deviceIds,
      devices:(store.devices.filter(d => group.deviceIds.includes(d.device_id)))
    }    
  });
  
  const widgets = expandedGroups.map((d) => <Widget controls={GroupCtrl} type='group' key={d.id} data={d}></Widget>);

  return (
    <Container>
      {widgets}
    </Container>
  );
}