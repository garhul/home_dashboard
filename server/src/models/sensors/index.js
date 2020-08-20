const fs = require('fs');
const SensorDB = require('./sensors');

const { logger, config } = global;

// Load from previously saved stuff
