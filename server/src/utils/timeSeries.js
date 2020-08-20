const defaults = {
  dbFile: null,
  depth: 24,
  validator: () => true,
};

class TimeSeries {
  constructor(options) {
    this.opts = Object.freeze(Object.assign(defaults, options));
    this.data = [];
    this.cursor = 0;
    this.depth = this.opts.depth;
    this.avg = 0;
    this.min = 0;
    this.max = 0;
  }

  datapointValid(datapoint) {
    return this.validator(datapoint);
  }

  addDataPoint(value, ts = Date.now()) {
    if (this.data.length === this.depth) {
      this.cursor = (this.cursor + 1) % this.depth;
      this.data[this.cursor] = { ts, value };

      this.avg = (this.avg + value) / 2;
      if (value < this.min) {
        this.min = value;
      } else if (value > this.max) {
        this.max = value;
      }
    }
  }

  get last() {
    return this.data[this.cursor];
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
