import React from 'react';
import Widgets from './widgets';
import { Container } from 'react-bootstrap';

export default function SesnorsView(props) {
  return (
    <Container>
      <Widgets {...props}></Widgets>
    </Container>
  );
}