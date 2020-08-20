const fs = require('fs');
const readline = require('readline');

const OF = 'living.[SENSOR_NAME]';
async function processLineByLine() {
  const fileStream = fs.createReadStream('sensors.data');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  // eslint-disable-next-line no-restricted-syntax
  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
    let output = null;
    if (line.charAt(0) !== '{') {
      const data = line.split('|');
      const ts = (new Date(data[0])).getTime();
      const obj = JSON.parse(data[1]);

      output = `${ts}|${obj.dht_t}|${obj.dht_h}|${(parseFloat(obj.bmp280_p) / 100).toFixed(1)}|${obj.bmp280_t}|${obj.vbat}\n`;
    } else {
      const data = JSON.parse(line);

      if (data !== undefined && 't' in data) {
        // {"t":1596288279112,"dht_temp":"27.7","dht_humidity":"34.0","bmp280_pressure":983.388,"bmp280_temp":"28.2","bat_voltage":"3.96"}
        output = `${data.t}|${data.dht_temp}|${data.dht_humidity}|${(parseFloat(data.bmp280_pressure)).toFixed(1)}|${data.bmp280_temp}|${data.bat_voltage}\n`;
      }
    }

    if (output !== null) {
      fs.writeFileSync('living_sensor.data', output, { flag: 'a+' });
    }
  }
}
processLineByLine();
