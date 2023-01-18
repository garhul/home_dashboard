import { timeSeriesSubset } from "@backend/types";

export type CMDLabelPropType = {
  label: string;
}

export type PlotPropType = {
  data: { t: number, v: number }[];
  color: string;
  min: number;
  max: number;
  unit: string;
  intervalWindow: number;
}

export type CMDButtonPropType = {
  style: string;
  label: string;
  update: (data: unknown) => void;
}

export type CMDRangeProps = {
  min: string;
  max: string;
  label: string;
  val: number;
  update: (data: string) => void;
}

export type SensorPropType = {
  channels: [
    { icon: string, key: string, color: string, unit: string }
  ];
  data: { key: string, series: timeSeriesSubset[] }[];
  lastSeen: number;
}