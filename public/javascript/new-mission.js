const electron = require("electron");
const { ipcRenderer } = electron;
const new_mission_form = document.getElementById("new-mission-form");
const mission_name = document.getElementById("mission-name-input");

new_mission_form.addEventListener("submit", e => {
  e.preventDefault();
  // alert(mission_name.value);
  ipcRenderer.send("create:newMission", mission_name.value);
});
