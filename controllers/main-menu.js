const allMissions = require("./all-missions");
const newMission = require("./new-mission");
const main = require("../main");

// Create the menuTemplate
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "New mission                       ",
        accelerator:
          process.platform == "darwin" ? "Command+N" : "Ctrl+N".length,
        click() {
          newMission.createNewMissionWindow();
        }
      },
      {
        label: "Close",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          main.app.quit();
        }
      }
    ]
  },
  {
    label: "Help",
    submenu: [
      {
        label: "User Manual                       ",
        accelerator: process.platform == "darwin" ? "Command+U" : "Ctrl+U"
      },
      {
        label: "Feedback                          ",
        accelerator: process.platform == "darwin" ? "Command+F" : "Ctrl+F"
      }
    ]
  }
];

// Add developer tools item in menu if not in production
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "DevTools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: "reload"
      }
    ]
  });
}

module.exports = mainMenuTemplate;
