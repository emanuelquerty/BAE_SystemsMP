"use strict";
const electron = require("electron");
const { ipcRenderer } = electron;

const results = document.getElementById("right-side-container__results");
let links = document.getElementsByClassName("link");

for (let i = 0; i < links.length; i++) {
  links[i].addEventListener("click", e => {
    const class_name = e.target.className.split(" ")[0];
    fetch(`../views/${class_name}.html`)
      .then(res => res.text())
      .then(res => {
        results.innerHTML = res;

        //Call recents wrapper to make content in recent.html available in recents.js
        recents_wrapper();
      });
  });
}

// function initMap() {
//   //Catch mission name sent from main.js entry file
//   ipcRenderer.on("create:newMission", (event, mission_name) => {
//     let options = {
//       zoom: 2,
//       center: { lat: 40.4637, lng: 3.7492 }
//     };

//     let map = new google.maps.Map(results, options);
//     let marker = new google.maps.Marker({
//       position: { lat: 40.4637, lng: 3.7492 },
//       map: map
//     });

//     marker.addListener("click", () => {
//       let contentString = "<h1> Lynn MA</h1>";
//       let infowindow = new google.maps.infoWindow({
//         content: contentString
//       });
//       infowindow.open(map, marker);
//     });
//   });
// }
