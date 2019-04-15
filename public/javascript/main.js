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
        console.log(class_name);
        //ipcRenderer.send(`load:${class_name}`);
        switch (class_name) {
          case "live-video": {
            live_video_wrapper();
            break;
          }
          case "recents": {
            recents_wrapper();
            break;
          }
          case "all-missions": {
            all_missions_wrapper();
            break;
          }
          default: {
            console.log("Sidebar error");
          }
        }

        //Couldn't think of another way, this is to call the wrapper function in each js
        // var arr = class_name.split('-');
        // var wrapper = '';
        // arr.forEach((word) => {
        //   wrapper += word;
        // });
        // console.log(wrapper)
        // var wrapperFunc = new Function(`${wrapper}_wrapper`);
        // wrapperFunc();

        //Call recents wrapper to make content in recent.html available in recents.js
      });
  });
}
