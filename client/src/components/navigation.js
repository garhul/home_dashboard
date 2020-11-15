import React, { useCallback, useEffect, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap'

export default function NavBar(props) {
  const [location, setLocation] = useState(window.location.hash || '#home');

  const changeLocation = useCallback((l) => {    
    const loc = l.slice(1);
    props.onChange(loc)
    setLocation(loc);
  },[props]);

  useEffect(() => { changeLocation(window.location.hash || '#home') }, [changeLocation]);

  return (
    <Navbar bg="dark" expand="lg">
      <Navbar.Brand onClick={() => {changeLocation('#home')}} href="#home">{`Home Dashboard >> ${location}`}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link onClick={() => {changeLocation('#devices')}} href="#devices">Devices</Nav.Link>
          <Nav.Link onClick={() => {changeLocation('#sensors')}} href="#sensors">Sensors</Nav.Link>
          <Nav.Link onClick={() => {changeLocation('#config')}} href="#config">Config</Nav.Link>        
        </Nav>      
      </Navbar.Collapse>
    </Navbar>
  );

}