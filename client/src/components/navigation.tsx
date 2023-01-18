import React, { useCallback, useEffect, useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap'
import {AiFillHome} from 'react-icons/ai';

export default function NavBar(props: any) {
  const changeLocation = (f) => {
    props.onChange(f);
  }

  const locations = [
    ['#home','Home'],
    ['#devices','Devices'],
    ['#sensors','Sensors'],
    ['#admin','Admin'],
  ].map(([hash, name]:[string, string]) => (
    <Nav.Link key={`nav_${hash}`} onClick={() => { changeLocation(hash) }} href={hash} active={props.location === hash}>{name}</Nav.Link>
  ));

  return (
    <Navbar fixed="top" bg="dark" variant="dark" expand="lg" collapseOnSelect={true}>
      <Navbar.Brand><AiFillHome style={{ "fontSize": "3vh" }}></AiFillHome></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {locations}
        </Nav>
      </Navbar.Collapse>
    </Navbar >
  );

}