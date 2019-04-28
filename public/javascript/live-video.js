var mediaMod = require("rtc-media");
var $ = require("jquery");
const { exec } = require("child_process");
var child = require("child_process").execFile;
("use strict");

function live_video_wrapper() {
  /* globals MediaRecorder */

  const mediaSource = new MediaSource();
  mediaSource.addEventListener("sourceopen", handleSourceOpen, false);
  let mediaRecorder;
  let recordedBlobs;
  let sourceBuffer;
  var telemData = {
    longitude: -110.44212,
    latitude: -52.34212,
    altitude: 60
  };

  //snapshot globals

  var streaming = false;
  var width = "720"; // We will scale the photo width to this
  var height = 0; // This will be computed based on the input stream
  var canvas = (canvas = document.getElementById("canvas"));
  var snapshotButton = document.getElementById("snapshot");
  var photo = document.getElementById("photo");

  const gumVideo = document.querySelector("video#gum");
  const errorMsgElement = document.querySelector("span#errorMsg");
  const recordedVideo = document.querySelector("video#recorded");
  const recordButton = document.querySelector("button#record");
  const stopButton = document.querySelector("button#stop");
  const metadataButton = document.querySelector("button#metadata");

  metadataButton.addEventListener("click", () => {
    metadata();
  });

  recordButton.addEventListener("click", () => {
    startRecording();
    recordButton.style.display = "none";
    stopButton.style.display = "inline-block";
  });

  stopButton.addEventListener("click", () => {
    stopRecording();
    download();
    stopButton.style.display = "none";
    recordButton.style.display = "inline-block";
  });

  const playButton = document.querySelector("button#play");
  playButton.addEventListener("click", () => {
    const superBuffer = new Blob(recordedBlobs, { type: "video/webm" });
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
    recordedVideo.play();
  });

  // const downloadButton = document.querySelector("button#download");
  // downloadButton.addEventListener(download);
  // fs = require("fs");
  // sys = require("util");
  // const blob = new Blob(recordedBlobs, { type: "video/webm" });
  // var reader = new FileReader();
  // reader.onload = function() {
  //   var buffer = new Buffer.from(reader.result);
  //   fs.writeFile("video.webm", buffer, {}, (err, res) => {
  //     if (err) {
  //       console.error(err);
  //       return;
  //     }
  //     console.log("video saved");
  //   });
  // };
  // reader.readAsArrayBuffer(blob);

  // //const url = window.URL.createObjectURL(blob);
  // // strip off the data: url prefix to get just the base64-encoded bytes
  // var data = url.replace(/^data:video\/\w+;base64,/, "");
  // var buf = Buffer.from(data, 'base64');
  // fs.writeFile('video.webm', buf, (err) => {
  //     if (err) throw err;
  //     console.log('The file has been saved!')});

  // const a = document.createElement('a');
  // a.style.display = 'none';
  // a.href = url;
  // a.download = 'test.webm';
  // document.body.appendChild(a);
  // a.click();
  // setTimeout(() => {
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);
  // }, 100);
  function download() {
    fs = require("fs");
    sys = require("util");
    const blob = new Blob(recordedBlobs, { type: "video/webm" });

    var reader = new FileReader();
    reader.onload = function() {
      var buffer = new Buffer.from(reader.result);
      fs.writeFile("video.webm", buffer, {}, (err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("video saved");
      });
    };
    reader.readAsArrayBuffer(blob);
  }

  snapshotButton.addEventListener(
    "click",
    function(ev) {
      console.log("Clicked");
      takepicture();
      ev.preventDefault();
    },
    false
  );

  clearphoto();

  function handleSourceOpen(event) {
    console.log("MediaSource opened");
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.log("Source buffer: ", sourceBuffer);
  }

  function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  }

  function startRecording() {
    recordedBlobs = [];
    let options = { mimeType: "video/webm;codecs=vp9" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not Supported`);
      errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
      options = { mimeType: "video/webm;codecs=vp8" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not Supported`);
        errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
        options = { mimeType: "video/webm" };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error(`${options.mimeType} is not Supported`);
          errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
          options = { mimeType: "" };
        }
      }
    }

    try {
      mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
      console.error("Exception while creating MediaRecorder:", e);
      errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(
        e
      )}`;
      return;
    }

    console.log(
      "Created MediaRecorder",
      mediaRecorder,
      "with options",
      options
    );

    mediaRecorder.onstop = event => {
      console.log("Recorder stopped: ", event);
    };
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10); // collect 10ms of data
    console.log("MediaRecorder started", mediaRecorder);
  }

  function stopRecording() {
    mediaRecorder.stop();
    //download();
    console.log("Recorded Blobs: ", recordedBlobs);
  }

  function handleSuccess(stream) {
    recordButton.disabled = false;
    snapshotButton.disabled = false;
    console.log("getUserMedia() got stream:", stream);
    window.stream = stream;

    gumVideo.srcObject = stream;
    gumVideo.play();
  }
  gumVideo.addEventListener(
    "canplay",
    function(ev) {
      console.log("played");
      if (!streaming) {
        height = gumVideo.videoHeight / (gumVideo.videoWidth / width);
        console.log(height);

        gumVideo.setAttribute("width", width);
        gumVideo.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        streaming = true;
      }
    },
    false
  );

  async function init(constraints) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleSuccess(stream);
    } catch (e) {
      console.error("navigator.getUserMedia error:", e);
      errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
    }
  }

  document.querySelector("button#start").addEventListener("click", async () => {
    const hasEchoCancellation = document.querySelector("#echoCancellation")
      .checked;
    //video: ee2bc71fab5e660c081a122160cb91420721401111881ebbd31ab6a6b71ed05f
    //Audio: c8b38ef381cdcd3c353388767b900b40d5b7d2f63c4b4c5c4780013e6832faef
    const constraints = {
      audio: {
        echoCancellation: { exact: hasEchoCancellation },
        deviceId:
          "c8b38ef381cdcd3c353388767b900b40d5b7d2f63c4b4c5c4780013e6832faef"
      },
      video: {
        deviceId:
          "ee2bc71fab5e660c081a122160cb91420721401111881ebbd31ab6a6b71ed05f",
        width: 1280,
        height: 720
      }
    };
    console.log("Using media constraints:", constraints);
    await init(constraints);
  });

  function clearphoto() {
    var context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  }

  function takepicture() {
    var context = canvas.getContext("2d");
    console.log("take picture");
    console.log(width);
    console.log(height);
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(gumVideo, 0, 0, width, height);

      var data = canvas.toDataURL("image/png");
      photo.setAttribute("src", data);

      fs = require("fs");
      sys = require("util");
      // string generated by canvas.toDataURL()
      var img = canvas.toDataURL();
      console.log(img);
      // strip off the data: url prefix to get just the base64-encoded bytes
      var data = img.replace(/^data:image\/\w+;base64,/, "");
      var buf = Buffer.from(data, "base64");
      fs.writeFile("image.png", buf, err => {
        if (err) throw err;
        console.log("The file has been saved!");
        openSocetGXP();

        ipcRenderer.send("photo:saved", "image.png");
      });
    } else {
      clearphoto();
    }
  }
  function openSocetGXP() {
   

    const fs = require("fs");
    fs.writeFile("telemetry.json", JSON.stringify(telemData), function(err) {
      if (err) {
        return console.log(err);
      }
      var executablePath =
        "C:\\Program Files\\BAE SYSTEMS\\SOCET GXP 4.3.0\\Exe\\StartGxpC.exe";
      var parameters = [
        "C:\\Program Files\\BAE SYSTEMS\\SOCET GXP 4.3.0\\bin\\ImageLoader.exe",
        "C:\\Users\\UA Student\\Documents\\BAE_SystemsMP\\image.png",
        "C:\\Users\\UA Student\\UAV Rescue Mission Template.tmpl",
        "C:\\Users\\UA Student\\Documents\\BAE_SystemsMP\\socet.jpg",
        "C:\\Users\\UA Student\\Documents\\BAE_SystemsMP\\telemetry.json"
      ];

      child(executablePath, parameters, function(err, data) {
        console.log(err);
        console.log(data.toString());
      });
      console.log("The file was saved!");
    });

    console.log("Open socet called");

    // let command = '"C:\\Program Files\\BAE SYSTEMS\\SOCET GXP 4.3.0\\Exe\\StartGxpC.exe" "C:\\Program Files\\BAE SYSTEMS\\SOCET GXP 4.3.0\\bin\\ImageLoader.exe" C:\\Users\\UA Student\\Documents\\BAE_SystemsMP\\image.png"'

    // exec(command, (err, stdout, stderr) => {
    //     if (err) {
    //         console.log(err);
    //       // node couldn't execute the command
    //       return;
    //     }

    //     // the *entire* stdout and stderr (buffered)
    //     console.log(`stdout: ${stdout}`);
    //     console.log(`stderr: ${stderr}`);
    //   });
  }
  // function metadata(){
  //   var dataset = gdal.open("C:\\Users\\UA Student\\Desktop\\Stereo_Top_Left_po_104901_pan_0000010000.ntf");

  //   dataset.layers.get(0).features.forEach(function(feature) {
  //       console.log(feature.getGeometry().toJSON());
  //   });

  // }

  ipcRenderer.on("dronePosition1", (event, data) => {
    document.getElementById("longitude1").innerHTML = data["lon "];
    document.getElementById("latitude1").innerHTML = data["lat "];
    document.getElementById("elevation1").innerHTML = data["alt "];
    telemData.longitude = data["lon "];
    telemData.latitude = data["lat "];
    telemData.altitude = data["alt "];

  });

  ipcRenderer.on("droneTelemetry1", (event, data) => {});

  ipcRenderer.on("dronePosition2", (event, data) => {
    // $("#longitude").innerHTML = 24;
    // $("#latitude").innerHTML = 24;
    // $("#elevation").innerHTML = 24;
    document.getElementById("longitude2").innerHTML = data["lon "];
    document.getElementById("latitude2").innerHTML = data["lat "];
    document.getElementById("elevation2").innerHTML = data["alt "];
  });

  ipcRenderer.on("droneTelemetry2", (event, data) => {});
}
