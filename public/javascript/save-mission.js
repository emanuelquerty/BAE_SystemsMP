function save_mission_wrapper() {
  ipcRenderer.send("save:mission", "save-mission");
  $("#mission-saved-container").fadeIn();
  setTimeout(() => {
    $("#mission-saved-container").fadeOut();
  }, 2000);
}
