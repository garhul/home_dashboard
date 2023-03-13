import { useEffect, useState } from "react";
import { Row, Badge } from "react-bootstrap";

function timeSince(t:number) {    
  const min = 60;
  const hour = 3600;
  const day = 86400;
  const week = 604800;


  if (t < min) {
    return `${t}s`;
  }

  if (t < hour) {
    return `${Math.floor(t / 60)}m`;
  }

  if (t < day) {
    return `${Math.floor(t / hour)}h`;
  }

  if (t < week) {
    return `${Math.floor(t / day)}d`;
  }

  return `${Math.floor(t / week)}w`;
}

export type ElapsedTimeBadgePropsType = {lastSeen:number}

export default function ElapsedTimeBadge(props: ElapsedTimeBadgePropsType) {
  const [ ,updateElapsed] = useState(0);
  const elapsedSeconds = Math.ceil((Date.now() - props.lastSeen) / 1000);

  useEffect(()=> {
    const interval = setInterval(() => updateElapsed(Date.now()), 10000);
    return () => {
      clearInterval(interval);
    };
  },[]);    
  return (
    <Row className="elapsed_time">
      <Badge bg={(elapsedSeconds < 3600) ? 'dark' : 'danger'}>{`${timeSince(elapsedSeconds)} ago`}</Badge>
    </Row>
  );
}