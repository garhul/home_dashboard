class TimeSeries {
  constructor(depth = 1440) {
    this._data = [];
    this.cursor = 0;
    this.depth = depth;
    this._min = null;
    this._max = null;
    this._avg = null;
  }

  get data() {
    return this._data;
  }

  addDataPoint(t, value) {
    let v = (typeof(value) === 'number') ? value : parseFloat(value);
    this._data[this.cursor] = [t, v];

    if (this._min === null || this._min > v) this._min = v;
    if (this._max === null || this._max < v) this._max = v;
    this._avg = (this._avg === null) ? v : (this._avg + v) / 2 ;
    
    if (this.cursor === this.depth) {
      this._data.shift();
    } else {
      this.cursor++;
    }
  }
  
  get last() {
    return this._data[this.cursor];
  }
  
  get min() {
    return this._min;
  }

  get max() {
    return this._max;
  }

  get avg() {
    return this._avg;
  }

  getRange(tsLeft, tsRight, granularity = 1) {
    let cc = 0;
    return this.data.filter((val) => {
      if (val.ts >= tsRight && val.ts <= tsLeft) {
        cc++;
        if (cc % granularity === 0) {
          return true;
        }
      }
      return false;
    });
  }
}

module.exports = TimeSeries;
