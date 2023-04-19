import { Row } from "react-bootstrap";
import { ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid, YAxis, XAxis } from "recharts";

export type PlotPropType = {
  data: { t: number, v: number }[];
  color: string;
  min: number;
  max: number;
  unit: string;
  intervalWindow: number;
}

export default function Plot(props: PlotPropType) {

  function tickFormatter(tick:number) {
    const d = new Date(tick);
    return `${d.toLocaleDateString('en-GB',{ month: 'numeric', 'day':'2-digit'})} : ${d.toLocaleTimeString('en-GB', {timeStyle:"short"})}`;
  }

  const labelFn = (l:number) => {
    const d = new Date(l);
    return `${d.toLocaleDateString('en-GB', { month: 'numeric', 'day':'2-digit'})} : ${d.toLocaleTimeString('en-GB',{timeStyle:"short"})}`;
  }

  return (
    <Row>
    {/* <Col style={{ "color": props.color }}> */}
      <ResponsiveContainer height={180} >
        <LineChart width={600} height={180} data={props.data}>
          <Line dot={false} type="monotone" dataKey="v" stroke={props.color} strokeWidth={1}  />
          <CartesianGrid stroke="#666" strokeDasharray="8" horizontal={true} vertical={false} strokeWidth={.5} />
          <YAxis width={50}  style={{ "fontSize": ".8em" }} />
          <Tooltip separator="" labelFormatter={labelFn} formatter={(v, n, p) => [`${parseFloat(v.toString()).toFixed(2)}${props.unit}`, '']} contentStyle={{ "backgroundColor": "#222", "border": "0" }} />
          <XAxis hide={false} interval={Math.ceil(props.data.length / 5)} dataKey="t" tick={true} tickFormatter={tickFormatter} style={{ "fontSize": ".75em" }} />
        </LineChart>
      </ResponsiveContainer>
    </Row>
  );
}
