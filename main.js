// nodemon --watch * --exec "electron ."

const electron = require("electron");
const url = require("url");
const path = require("path");
const fs = require("fs");

const { app, BrowserWindow, Menu, ipcMain } = electron;
const mainMenuTemplate = require("./controllers/main-menu");
const newMission = require("./controllers/new-mission");
const SaveMissionName = require("./controllers/save-mission");

let mainWindow;

// Wait for the app to be ready
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // webContents.loadURL(url, {"extraHeaders" : "pragma: no-cache\n"})

  // Load index.html content in mainWindow
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views", "index.html"),
      protocol: "file:",
      slashes: true
    }),
    { extraHeaders: "pragma: no-cache\n" }
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
    app.quit();
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  exports.mainWindow = mainWindow;
});

// Catch mission name sent from new-mission.js
ipcMain.on("create:newMission", (event, mission_name) => {
  mainWindow.webContents.send("create:newMission", mission_name);

  // This saves the mission name at "./data/" as mission_name
  const Mission = new SaveMissionName();
  Mission.saveMissionName(mission_name);

  //Close the new mission window
  newMission.newMissionWindow.close();
});

// Catch Save New Mission sent from save-mission.js
ipcMain.on("save:mission", (event, data) => {
  const Mission = new SaveMissionName();
  Mission.saveMissionData();
});

ipcMain.on("dronePosition1", (event, data) => {
  mainWindow.webContents.send("dronePosition1", data);
});

ipcMain.on("droneTelemetry1", (event, data) => {
  mainWindow.webContents.send("droneTelemetry1", data);
});

ipcMain.on("dronePosition2", (event, data) => {
  mainWindow.webContents.send("dronePosition2", data);
});

ipcMain.on("droneTelemetry2", (event, data) => {
  mainWindow.webContents.send("droneTelemetry2", data);
});

// Quit app when the last window is closed
app.on("window-all-closed", () => {
  app.quit();
});

// If user is on Mac, add empty object to the menu as the first menu item
if (process.platform == "darwin") {
  mainMenuTemplate.unshift({ label: "" });
}

exports.app = app;
