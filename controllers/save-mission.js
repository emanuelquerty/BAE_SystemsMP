
  const ACCESS_KEY_ID = "AKIAJ4DGSICL5JSFHNTQ";
  const SECRET_ACCESS_KEY = "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";

const fs = require("fs");
const path = require("path");
class MissionName {
  // constructor(mission_name) {
  //   this.mission_name = mission_name;
  // }

  // This saves the mission name at "./data/"
  saveMissionName(mission_name) {
    fs.writeFile("./data/mission-name.txt", mission_name, err => {
      if (err) {
        console.log("Could not save mission name");
      } else {
        console.log("Mission name saved successfully");
      }
    });
  }

  // This saves the mission image and vide on aws database
  saveMissionData() {
    // Load the AWS SDK for Node.js
    let AWS = require("aws-sdk");

    //configuring the AWS environment
    AWS.config.update({
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY
    });

    // Create S3 service object
    const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

    // Get the mission-name from file mission-name.txt.
    //Data will be saved at in the bucket with the mission name read from this file
    fs.readFile(
      path.join(__dirname, "..", "data", "mission-name.txt"),
      (err, mission_name) => {
        if (err) {
          console.log(err);
          console.log("could not read mission name from file mission-name.txt");
        } else {
          console.log("Mission name:" + mission_name);
          mission_name = String(mission_name);
          mission_name = mission_name.toLowerCase();

          // Save the image
          this.uploadFile(mission_name, "image.png", s3);

          //Save the video
          this.uploadFile(mission_name, "video.webm", s3);

          //Save drone1.txt file
          this.uploadFile(mission_name, "drone1.txt", s3);

          //Save drone2.txt file
          this.uploadFile(mission_name, "drone2.txt", s3);

          //Save droneInput.json file
          this.uploadFile(mission_name, "droneInput.json", s3);

          //Save telemetry.json file
          this.uploadFile(mission_name, "telemetry.json", s3);
        }
      }
    );
  }

  uploadFile(mission_name, filename, s3) {
    //// Read in the  image file, convert it to base64 and store to S3
    fs.readFile(path.join(__dirname, "..", "data", filename), (err, file) => {
      if (err) {
        console.log("Could not read File to store to AWS s3");
      } else {
        console.log("File to store to AWS s3 was read successfully");
        // Convert the file that was read to base64
        console.log(file);
        let oneGigInBytes = 1073741824;
        let base64data = Buffer.from(file, "binary");

        // Create the param variable to use in the s3.putObject method.
        // First set the param to create a bucket. Param for bucket has no Body
        let params = {
          Bucket: "bae-systems-mp",
          Key: `${mission_name}/`,
          ACL: "public-read"
        };

        // Create a bucket
        s3.putObject(params, function(err, data) {
          if (err) {
            // console.log(err, err.stack);
          } else {
            // console.log(data);
          }
        });

        // Set the param for uploading the file in the bucket that was just created
        params = {
          Bucket: "bae-systems-mp",
          Key: `${mission_name}/${filename}`,
          Body: base64data,
          ACL: "public-read"
        };

        // Upload the file in the bucket that was just created
        s3.putObject(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log(data);
          }
          // console.log(arguments);
          // console.log(res);
          console.log("Successfully uploaded package.");

          // // Check if object in in the bucket
          // s3.headObject(
          //   {
          //     Bucket: "bae-systems-mp",
          //     Key: `${mission_name}/${filename}`
          //   },
          //   function(res) {
          //     console.log(res);
          //   }
          // );
        });
      }
    });
  }
}
module.exports = MissionName;
