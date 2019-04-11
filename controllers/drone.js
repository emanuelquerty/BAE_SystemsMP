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
            console.log(main);
        } catch (e) {
            // console.log('error parsing JSON');
        }
    }
  });
}