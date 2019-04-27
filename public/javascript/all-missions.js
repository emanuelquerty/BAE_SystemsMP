"use strict";

// ipcRenderer.on("open:allMissions", (event, filename) => {
// fetch(`../views/${filename}.html`)
//   .then(res => res.text())
//   .then(res => {
//     results.innerHTML = res;

function all_missions_wrapper() {
  const docfrag = document.createDocumentFragment();
  const all_missions_wrapper = document.getElementById("all-missions-wrapper");

  /* AWS STARTS HERE */
  // Load the AWS SDK for Node.js
  let AWS = require("aws-sdk");

  //configuring the AWS environment
  AWS.config.update({
    accessKeyId: "AKIAI543IKTH6OPIMCIQ",
    secretAccessKey: "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"
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
        }
        i = i + 1;
      }
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
          video_1.src = `http://d124dvymmzm1a.cloudfront.net/${key}/video.webm`;
          image1.src = `http://d124dvymmzm1a.cloudfront.net/${key}/image.png`;
        });
    }, 1000);
  }
}
