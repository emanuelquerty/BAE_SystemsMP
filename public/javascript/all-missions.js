"use strict";
const ACCESS_KEY_ID = "AKIAJ4DGSICL5JSFHNTQ";
const SECRET_ACCESS_KEY = "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";

function all_missions_wrapper() {
  const docfrag = document.createDocumentFragment();
  const all_missions_wrapper = document.getElementById("all-missions-wrapper");

  /* AWS STARTS HERE */
  // Load the AWS SDK for Node.js
  let AWS = require("aws-sdk");

  //configuring the AWS environment
  AWS.config.update({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
  });

  // Create S3 service object
  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

  // Create the parameters for calling listObjects
  var bucketParams = {
    Bucket: "bae-systems-mp"
  };

  // Call S3 to obtain a list of the objects in the bucket
  s3.listObjects(bucketParams, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      // console.log("Success", data.Contents);

      let i = 0;
      console.log(data.Contents);
      // Sort content by date
      data.Contents.sort(function(a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.LastModified) - new Date(a.LastModified);
      });
      for (let content of data.Contents) {
        let key = content.Key;
        let date = content.LastModified;
        let options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        };
        date = date.toLocaleDateString("us", options);
        console.log(key);
        if (key.endsWith("/")) {
          key = key.slice(0, -1);
          const mission_container = document.createElement("mission-container");
          mission_container.className = "mission-container";
          if (i % 2 == 0) {
            mission_container.style.background = "rgb(233, 233, 233)";
          }

          const img = document.createElement("img");
          img.className = "mission-image";
          img.src = "../public/images/report.jpg";

          const p1 = document.createElement("p");
          const p2 = document.createElement("p");
          p1.className = "mission-name";
          p1.innerHTML = key;
          p2.className = "mission-date";
          p2.innerHTML = date;

          const mission_details = document.createElement("div");
          mission_details.appendChild(p1);
          mission_details.appendChild(p2);
          mission_details.className = "mission-details";

          mission_container.appendChild(img);
          mission_container.appendChild(mission_details);
          docfrag.appendChild(mission_container);

          mission_container.addEventListener("click", function(e) {
            (function(e, key) {
              openMissionData(key);
            })(e, key);
          });
          i = i + 1;
        }
      }
    }
    if (data.Contents.length != 0) {
      all_missions_wrapper.style.display = "block";
    }
    all_missions_wrapper.appendChild(docfrag);
  });
  /* AWS ENDS HERE */
  function openMissionData(key) {
    fetch(`../views/loader.html`)
      .then(res => res.text())
      .then(res => {
        results.innerHTML = res;
      });

    setTimeout(function() {
      fetch(`../views/mission-data.html`)
        .then(res => res.text())
        .then(res => {
          results.innerHTML = res;
          let video_1 = document.getElementById("video-1-src");
          let image1 = document.getElementById("mission-image");
          let image_opener = document.getElementById(
            "image-opener__mission-image"
          );
          let video_opener = document.getElementById(
            "video-opener__mission-video"
          );
          let image_opener_name = document.getElementById("image-opener-name");
          let video_opener_name = document.getElementById("video-opener-name");

          video_1.src = `http://d124dvymmzm1a.cloudfront.net/${key}/video.webm`;
          image1.src = `http://d124dvymmzm1a.cloudfront.net/${key}/image.png`;
          image_opener.src = `http://d124dvymmzm1a.cloudfront.net/${key}/image.png`;

          let name = `${key}.png`;
          name = name.replace(/\s/g, "");
          console.log(name);
          image_opener_name.innerHTML = name;

          name = `${key}.webm`;
          name = name.replace(/\s/g, "");
          console.log(name);
          video_opener_name.innerHTML = name;

          let image_wrapper = document.getElementsByClassName("image-wrapper");
          let video_wrapper = document.getElementsByClassName("video-wrapper");
          let close_img_file = document.getElementById("close-img-file");
          let close_video_file = document.getElementById("close-video-file");
          let mission_wrapper = document.getElementById("mission-wrapper");

          image_opener.addEventListener("click", () => {
            image_wrapper[0].style.display = "block";
            close_img_file.style.display = "block";
          });

          video_opener.addEventListener("click", () => {
            video_wrapper[0].style.display = "block";
            close_video_file.style.display = "block";
          });

          close_img_file.addEventListener("click", () => {
            image_wrapper[0].style.display = "none";
            close_img_file.style.display = "none";
          });

          close_video_file.addEventListener("click", () => {
            video_wrapper[0].style.display = "none";
            close_video_file.style.display = "none";
            let mission_video = document.getElementById("mission-video");
            mission_video.pause();
            mission_video.currentTime = 0;
          });

          // The following is for downloading the telemetry.json, droneInput.json, drone1.txt and drone2.txt
          let mission_data = document.getElementsByClassName("mission-data");
          for (let item of mission_data) {
            item.addEventListener("click", e => {
              let className_array = e.target.className.split(" ");
              let filename = className_array[1];
              let mission_name = key;
              mission_name = mission_name.trim();

              switch (filename) {
                case "telemetry":
                  downloadFile(mission_name, "telemetry.json");
                  break;
                case "droneInput":
                  downloadFile(mission_name, "droneInput.json");
                  break;
                case "drone1":
                  downloadFile(mission_name, "drone1.txt");
                  break;
                case "drone2":
                  downloadFile(mission_name, "drone2.txt");
                  break;
              }

              console.log(filename);
            });
          }
        });
    }, 1000);
  }

  function downloadFile(mission_name, filename) {
    // Load the AWS SDK for Node.js
    const AWS = require("aws-sdk");

    // Require needed
    const fs = require("fs");

    //configuring the AWS environment
    AWS.config.update({
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY
    });

    // Create S3 service object
    const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

    console.log(`${mission_name}/${filename}`);

    let params = {
      Bucket: "bae-systems-mp",
      Key: `${mission_name}/${filename}`
    };

    // Set the path in which the file will be saved
    // let filePath = "";
    // if (process.platform == "darwin") {
    //   const homedir = require("os").homedir();
    //   console.log(homedir);
    //   filePath = `${homedir}/Downloads/${filename}`;
    // }

    let filePath = "";
    const homedir = require("os").homedir();
    console.log(homedir);
    filePath = `${homedir}/Downloads/${filename}`;

    // const filePath = `./data/${filename}`;

    s3.getObject(params, (err, data) => {
      if (err) console.error(err);
      fs.writeFileSync(filePath, data.Body.toString());
      // let onFinishedDownload = document.getElementById(
      //   "file-downloaded-message"
      // );
      $("#file-downloaded-message ").fadeIn();
      setTimeout(() => {
        $("#file-downloaded-message ").fadeOut();
      }, 8000);
    });
  }
}
