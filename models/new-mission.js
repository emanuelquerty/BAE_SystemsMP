const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

//configuring the AWS environment
AWS.config.update({
  accessKeyId: "AKIAI543IKTH6OPIMCIQ",
  secretAccessKey: "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"
});

var s3 = new AWS.S3();
var filePath = "../video.webm";

//configuring parameters
var params = {
  Bucket: "bae-systems-mp",
  Body: fs.createReadStream(filePath),
  Key: "folder/" + Date.now() + "_" + path.basename(filePath)
};

s3.upload(params, function(err, data) {
  //handle error
  if (err) {
    console.log("Error", err);
  }

  //success
  if (data) {
    console.log("Uploaded in:", data.Location);
  }
});
