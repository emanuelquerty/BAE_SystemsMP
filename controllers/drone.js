const { spawn } = require('child_process');
const { ipcRenderer } = electron;
// const main = require('../main');

let posData = {};
let telemData = {};

let MAVProxy;

exports.connect = function connectToDrone(comPort = "") {
  if (comPort == "") {
      MAVProxy = spawn('mavproxy');
  } else {
      MAVProxy = spawn('mavproxy', ['--cmd="master="'+ comPort +'""']);
  }

  setInterval(() => {
      MAVProxy.stdin.write('status\n');
  }, 200);
  
  MAVProxy.stdout.on('data', (data) => {
    if (data.toString().includes('GLOBAL_POSITION_INT')) {
        const posIndex = data.toString().indexOf('GLOBAL_POSITION_INT');
        let outString = data.toString().substring(posIndex + 19, posIndex + 160) + '\n';
        outString = outString.substring(0, outString.lastIndexOf('}') + 1);
        outString = outString.replace(/([a-z][^:]*)(?=\s*:)/g, '"$1"');
    
        try {
            posData = JSON.parse(outString);
            ipcRenderer.send('dronePosition', posData);
        } catch (e) {
            // console.log('error parsing JSON');
        }
    }

    if (data.toString().includes('SYS_STATUS')) {
        const attIndex = data.toString().indexOf('ATTITUDE');
        let outString = data.toString().substring(attIndex + 9, attIndex + 200) + '\n';
        outString = outString.substring(0, outString.lastIndexOf('}') + 1);
        outString = outString.replace(/([a-z][^:]*)(?=\s*:)/g, '"$1"');

        try {
          telemData = JSON.parse(outString);
          ipcRenderer.send('droneTelemetry', telemData);
        } catch (e) {
          console.log('error parsing telem JSON');
        }
      }

    if (data.toString().includes('MISSION_ACK')) {
        console.log(data.toString());
    }

    if (data.toString().includes('APM')) {
        console.log(data.toString());
    }
  });
}