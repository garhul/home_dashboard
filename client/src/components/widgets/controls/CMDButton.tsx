import { Button } from "react-bootstrap";

export type CMDButtonPropType = {
  style: string;
  label: string;
  update: (data: string) => void;
}

export default function CMDButton(props: CMDButtonPropType) {  
  return (
    <Button 
      variant={(!props.style) ? "outline-info" : props.style}
      size="lg"
      onClick={() =>  props.update('')}
      >
      {props.label}
    </Button>)
}