// nodemon --watch * --exec "electron ."

const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;
const mainMenuTemplate = require("./controllers/main-menu");
const newMission = require("./controllers/new-mission");

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

  // Load index.html content in mainWindow
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "views", "index.html"),
      protocol: "file:",
      slashes: true
    })
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
  console.log(mission_name);
  newMission.newMissionWindow.close();
});

ipcMain.on("dronePosition", (event, data) => {
  mainWindow.webContents.send("dronePosition", data);
});

ipcMain.on("droneTelemetry", (event, data) => {
  mainWindow.webContents.send("droneTelemetry", data);
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
