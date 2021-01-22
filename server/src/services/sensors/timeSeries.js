const DAY = 24 * 3600000;  //miliseconds in a day
const WEEK = DAY * 7;
const MONTH = DAY * 31;
const YEAR = DAY * 365;

class TimeSeries {
  constructor(depth = 1440) {
    this.depth = depth;
    this.subSets = {
      I: { resolution:1 , data:[], keys: {}},
      D: { resolution:Math.floor(DAY / depth) , data:[], keys: {}},
      W: { resolution:Math.floor(WEEK / depth), data:[], keys: {}},
      M: { resolution:Math.floor(MONTH / depth), data:[], keys: {}},
      Y: { resolution:Math.floor(YEAR / depth), data:[], keys: {}},
    };    
  }

  get data() {
    return this.subSets;
  }
  
  _addToSubset(t, v, subSet) {
    if (
      (subSet.data.length === 0) ||
      ((subSet.data[subSet.data.length -1].t + subSet.resolution) < t) 
      ) {        
        subSet.data.push({ t,  v: {...v} }); // do not store a reference to v
    } else {
      // store superSample as average  
      Object.keys(v).forEach(j => {
        subSet.data[subSet.data.length - 1].v[j] = (subSet.data[subSet.data.length - 1].v[j] + v[j]) / 2;
      });
    }
    
    Object.keys(v).forEach(k => {        
      const lastInsertion = (subSet.data[subSet.data.length -1].v)[k];
      if (!subSet.keys[k]) {
        subSet.keys[k] = {
          avg: lastInsertion,
          min: lastInsertion,
          max: lastInsertion,
          last: lastInsertion
        }
      } else {
        subSet.keys[k].avg = (subSet.keys[k].avg + lastInsertion) / 2;
        subSet.keys[k].min = (subSet.keys[k].min > lastInsertion) ? lastInsertion : subSet.keys[k].min;
        subSet.keys[k].max = (subSet.keys[k].max < lastInsertion) ? lastInsertion : subSet.keys[k].max;
        subSet.keys[k].last = lastInsertion;
      }
    });
    
    // Adjust the buffer length
    if (subSet.data.length > this.depth) subSet.data.shift();
  }

  addDataPoint(t, values) {
    let v = {};

    Object.keys(values).forEach(k => {
      v[k] = (typeof(values[k]) === 'number') ? values[k] : parseFloat(values[k]);
    });
    
    Object.keys(this.subSets).forEach(k => this._addToSubset(t, v, this.subSets[k]));
  }
}

module.exports = TimeSeries;
