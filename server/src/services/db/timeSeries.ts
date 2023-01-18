import { timeSeriesSubsetKey, timeSeriesSubset } from '../../types';

const DAY = 24 * 3600;  //seconds in a day
const WEEK = DAY * 7;
const MONTH = DAY * 31;
const YEAR = DAY * 365;

export default class TimeSeries {
  #depth: number;
  #subsets: timeSeriesSubset[] = [];

  constructor(rolloverDepth: number) {
    this.#depth = rolloverDepth;

    this.#subsets.push(this.#createSubset('Immediate', 1));
    this.#subsets.push(this.#createSubset('Day', Math.ceil(DAY / this.#depth)));
    this.#subsets.push(this.#createSubset('Week', Math.ceil(WEEK / this.#depth)));
    this.#subsets.push(this.#createSubset('Month', Math.ceil(MONTH / this.#depth)));
    this.#subsets.push(this.#createSubset('Year', Math.ceil(YEAR / this.#depth)));

  }

  #createSubset(key: timeSeriesSubsetKey, timeWindow: number): timeSeriesSubset {
    return {
      key,
      series: [],
      timeWindow,
      extras: { min: null, max: null, avg: null, median: null, last: null }
    }
  }

  /** Stores a sample point, each sample point can consist of several keys an values
   * Data will rollover after exceeding rolloverDepth
   * 
   * @param vals {dataPoint} [key {string}, value {number}] array containing 1 or more entries
   * @param timestamp {Number} seconds for the datapoint, defaults to Math.ceil(Date.now() / 1000)
   * 
   */
  addSample(value: number, timestamp: number = Math.ceil(Date.now() / 1000)) {
    if (isNaN(value))
      throw new Error(`Error parsing timeseries value ${value} is not a number`);

    this.#subsets = this.#subsets.map((subset) => {
      if (subset.series.length === 0) {
        subset.series.push([timestamp, value]);
      } else {
        const lastDataPoint = subset.series[subset.series.length - 1];
        if ((lastDataPoint[0] + subset.timeWindow) > timestamp) {
          subset.series[subset.series.length - 1] = [lastDataPoint[0], (lastDataPoint[1] + value) / 2];
        } else {
          subset.series.push([timestamp, value]);
        }

        if (subset.series.length > this.#depth)
          subset.series.shift();
      }

      // perform aggregation             
      subset.extras.last = value;
      subset.extras.avg = (subset.extras.avg === null) ? value : Math.ceil((subset.extras.avg + value) / 2);
      subset.extras.median = (subset.extras.median === null) ?
        value :
        this.#computeMedian(subset.series.map(([k, v]: [number, number]) => Math.ceil(v)));

      if (subset.extras.min === null || subset.extras.min > value) {
        subset.extras.min = value;
      }

      if (subset.extras.max === null || subset.extras.max < value) {
        subset.extras.max = value;
      }

      return subset;
    });

  }

  #computeMedian(values: number[]): number {
    if (values.length === 1) return values[0];
    values.sort();
    if (values.length % 2 === 0) {
      return (values[Math.ceil(values.length / 2) - 1] + values[Math.ceil(values.length / 2)] / 2);
    } else {
      return values[Math.ceil(values.length / 2)];
    }
  }

  getSubsets(range: number = 0) {
    return this.#subsets;
  }

  getData(): timeSeriesSubset[] {
    return this.#subsets;
  }
}