import { Badge } from "react-bootstrap";

export type CMDLabelPropType = {
  label: string;
}

export default function CMDLabel(props: CMDLabelPropType) {
  return (
    <Badge bg="primary">
      {props.label}
    </Badge>
  )
}