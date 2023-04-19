import { Container } from "react-bootstrap";

export default function AdminWidget(props: any) {
  return (
    <Container className='widget'>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <h2>{props.title}</h2>
        {props.actions}
      </div>
      <Container style={{ marginTop: '2em' }}>
        {props.children}
      </Container>
    </Container >
  );
}