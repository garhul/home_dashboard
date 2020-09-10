class TimeSeries {
  constructor(depth = 1440) {
    this.data = [];
    this.cursor = 0;
    this.depth = depth;
  }

  addDataPoint(value) {
    const ts = ('ts' in value) ? value.ts : Date.now();
    if (this.cursor === this.depth) {
      this.data.shift();
    } else {
      this.cursor++;
    }
    this.data[this.cursor] = [ts, value];
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
