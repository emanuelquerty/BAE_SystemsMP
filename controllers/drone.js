const { spawn } = require('child_process');
const { ipcRenderer } = electron;
// const main = require('../main');

let posData1 = {};
let posData2 = {};
let telemData1 = {};
let telemData2 = {};

let MAVProxy1;
let MAVProxy2;

exports.connect1 = function connectToDrone1(comPort = "") {
  if (comPort == "") {
      MAVProxy1 = spawn('mavproxy');
  } else {
      // MAVProxy1 = spawn('mavproxy', ['--master="'+ comPort +'"']);
      MAVProxy1 = spawn('mavproxy', ['--master=COM' + comPort]);
      console.log(comPort);
  }

  setInterval(() => {
      //MAVProxy1.stdin.write('status\n');
  }, 200);
  
  MAVProxy1.stdout.on('data', (data) => {
    if (data.toString().includes('GLOBAL_POSITION_INT')) {
        const posIndex = data.toString().indexOf('GLOBAL_POSITION_INT');
        let outString = data.toString().substring(posIndex + 19, posIndex + 160) + '\n';
        outString = outString.substring(0, outString.lastIndexOf('}') + 1);
        outString = outString.replace(/([a-z][^:]*)(?=\s*:)/g, '"$1"');
    
        try {
            posData1 = JSON.parse(outString);
            posData1['lat '] /= 10000000;
            posData1['lon '] /= 10000000;
            ipcRenderer.send('dronePosition1', posData1);
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
          telemData1 = JSON.parse(outString);
          ipcRenderer.send('droneTelemetry1', telemData1);
        } catch (e) {
          // console.log('error parsing telem JSON');
        }
      }

    if (data.toString().includes('MISSION_ACK')) {
        console.log('Drone 1: ' + data.toString());
    }

    if (data.toString().includes('APM')) {
        console.log('Drone 1: ' + data.toString());
    }
  });
}

exports.load1 = function load1(fileName = "") {
  MAVProxy1.stdin.write('wp list\n');
  if (fileName === "") {
    MAVProxy1.stdin.write('wp load drone1.txt\n');
  } else {
    MAVProxy1.stdin.write('wp load ' + fileName + '\n');
  }
}

exports.connect2 = function connectToDrone2(comPort = "") {
  if (comPort == "") {
      MAVProxy2 = spawn('mavproxy');
  } else {
      MAVProxy2 = spawn('mavproxy', ['--master=COM' + comPort]);
  }

  setInterval(() => {
      //MAVProxy2.stdin.write('status\n');
  }, 200);
  
  MAVProxy2.stdout.on('data', (data) => {
    if (data.toString().includes('GLOBAL_POSITION_INT')) {
        const posIndex = data.toString().indexOf('GLOBAL_POSITION_INT');
        let outString = data.toString().substring(posIndex + 19, posIndex + 160) + '\n';
        outString = outString.substring(0, outString.lastIndexOf('}') + 1);
        outString = outString.replace(/([a-z][^:]*)(?=\s*:)/g, '"$1"');
    
        try {
            posData2 = JSON.parse(outString);
            posData2['lat '] /= 10000000;
            posData2['lon '] /= 10000000;
            ipcRenderer.send('dronePosition2', posData2);
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
          telemData2 = JSON.parse(outString);
          ipcRenderer.send('droneTelemetry2', telemData2);
        } catch (e) {
          // console.log('error parsing telem JSON');
        }
      }

    if (data.toString().includes('MISSION_ACK')) {
        console.log('Drone 2: ' + data.toString());
    }

    if (data.toString().includes('APM')) {
        console.log('Drone 2: ' + data.toString());
    }
  });
}

exports.load2 = function load2(fileName = "") {
  MAVProxy2.stdin.write('wp list\n');
  if (fileName === "") {
    MAVProxy2.stdin.write('wp load drone2.txt\n');
  } else {
    MAVProxy2.stdin.write('wp load ' + fileName + '\n');
  }
}
