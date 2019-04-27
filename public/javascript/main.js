"use strict";
const electron = require("electron");
const { ipcRenderer } = electron;
const results = document.getElementById("right-side-container__results");
let links = document.getElementsByClassName("link");
let toggle_dark_mode = document.getElementById("toggle-dark-mode");

toggle_dark_mode.addEventListener("click", e => {
  if (e.target.innerHTML == "toggle_on") {
    e.target.innerHTML = "toggle_off";
    change_screen_mode(e);
  } else {
    e.target.innerHTML = "toggle_on";
    change_screen_mode(e);
  }
});

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
          case "save-mission": {
            save_mission_wrapper();
          }

          default: {
            console.log("Sidebar error");
          }
        }
      });
  });
}

/* This is for the search box */
$(document).ready(function() {
  $("#search-box").on("focus", function() {
    $("#search-box-results").fadeIn();

    // Find missions that start with the word the user enters
    $("#search-box").on("keyup", function(e) {
      let mission_name = e.target.value;

      if (mission_name != "") {
        search_box_results_wrapper(mission_name);
      }
    });
  });

  $("#search-box").on("blur", function() {
    $("#search-box-results").fadeOut();
  });
});
