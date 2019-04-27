"use strict";
// import { openMissionData } from "./all-missions.js";

function search_box_results_wrapper(mission_name) {
  let search_box_results = document.getElementById("search-box-results");
  let docFrag = document.createDocumentFragment();

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
}

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
        console.log(image1);
        video_1.src = `http://d124dvymmzm1a.cloudfront.net/${key}/video.webm`;
        image1.src = `http://d124dvymmzm1a.cloudfront.net/${key}/image.png`;
      });
  }, 1000);
}
