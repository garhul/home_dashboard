import React from 'react';
import { Badge, Container, Nav, Navbar } from 'react-bootstrap'
import { AiFillHome, AiOutlineWarning } from 'react-icons/ai';
import useStore from '../store';

export default function NavBar(props: any) {
  const changeLocation = (f) => {
    props.onChange(f);
  }

  const locations = [
    ['#home', 'Home'],
    ['#devices', 'Devices'],
    ['#sensors', 'Sensors'],
    ['#admin', 'Admin'],
  ].map(([hash, name]: [string, string]) => (
    <Nav.Link key={`nav_${hash}`} onClick={() => { changeLocation(hash) }} href={hash} active={props.location === hash}>{name}</Nav.Link>
  ));

  return (
    <Navbar fixed="top" bg="dark" variant="dark" expand="lg" collapseOnSelect={true}>
      <Container fluid>
        <Navbar.Brand><AiFillHome style={{ "fontSize": "3vh" }}></AiFillHome></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {locations}
          </Nav>
        </Navbar.Collapse>
        <WsBadge />
        <VersionBadge />
      </Container>
    </Navbar >
  );

}

function WsBadge() {
  const wsConnected = useStore((state) => state.wsConnected);
  return (<Badge className={wsConnected ? 'hide' : ''} bg="dark" text="warning"><AiOutlineWarning style={{ fontSize: "2vh" }} /> Websocket Disconnected</Badge>)
}

function VersionBadge() {
  const version = useStore((state) => state.buildVersion);
  return (<Badge bg="info" text="dark" style={{ opacity: '.75', fontWeight: 100 }} >{version}</Badge>)
}