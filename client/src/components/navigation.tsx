import React, { useCallback, useEffect, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap'
import {AiFillHome} from 'react-icons/ai';

export default function NavBar(props: any) {
  const [, setLocation] = useState(window.location.hash || '#home');

  const changeLocation = useCallback((l) => {
    const loc = l.slice(1);
    props.onChange(loc)
    setLocation(loc);
  }, [props]);

  useEffect(() => { changeLocation(window.location.hash || '#home') }, [changeLocation]);

  return (
    <Navbar fixed="top" bg="dark" expand="lg" collapseOnSelect={true}>
      <Navbar.Brand><AiFillHome style={{ "fontSize": "3vh" }}></AiFillHome></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link onClick={() => { changeLocation('#home') }} href="#home">Home</Nav.Link>
          <Nav.Link onClick={() => { changeLocation('#devices') }} href="#devices">Devices</Nav.Link>
          <Nav.Link onClick={() => { changeLocation('#sensors') }} href="#sensors">Sensors</Nav.Link>
          <Nav.Link onClick={() => { changeLocation('#admin') }} href="#admin">Admin</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar >
  );

}