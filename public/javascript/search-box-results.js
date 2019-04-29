"use strict";

function search_box_results_wrapper(mission_name) {
  // Turn mission name to lower case as all mission name are saved in lowercase on aws
  mission_name = mission_name.toLowerCase();

  const ACCESS_KEY_ID = "PASTE_ACCESS_KEY_ID_HERE";
  const SECRET_ACCESS_KEY = "PASTE_SECRET_ACCESS_KEY";

  let search_box_results = document.getElementById("search-box-results");
  let docFrag = document.createDocumentFragment();

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
        // console.log(key);
        if (key.startsWith(mission_name) && key.endsWith("/")) {
          key = key.slice(0, -1);
          let p = document.createElement("p");
          p.id = key;
          p.innerHTML = key;
          p.style.margin = "0.1em";
          p.style.fontSize = "0.8rem";
          p.style.cursor = "pointer";
          p.style.color = "rgb(68, 68, 68)";
          p.addEventListener("mouseover", () => {
            p.style.backgroundColor = "#d0d5da";
          });
          p.addEventListener("mouseout", () => {
            p.style.backgroundColor = "#fff";
          });

          p.addEventListener("click", e => {
            (function(key) {
              openMissionData(key);
            })(key);
          });
          docFrag.appendChild(p);
          break;
        }
      }
      search_box_results.innerHTML = "";
      search_box_results.appendChild(docFrag);
    }
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
    let filePath = "";
    if (process.platform == "darwin") {
      const homedir = require("os").homedir();
      console.log(homedir);
      filePath = `${homedir}/Downloads/${filename}`;
    }

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
