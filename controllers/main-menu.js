const allMissions = require('./all-missions');
const newMission = require('./new-mission');
const main = require('../main');

// Create the menuTemplate
const mainMenuTemplate = [
    {
        label:'File',
        submenu: [
            { 
                label: 'New mission                       ',
                accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N'.length,
                click(){
                    newMission.createNewMissionWindow();
                }
            },
            { 
                label: 'Open a mission                    ',
                accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O'
            },
            {
                label: 'Save mission                      ',
                accelerator: process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S'
            },
            {
                label: 'Save mission as                   ',
                accelerator: process.platform == 'darwin' ? 'Shift+Command+S' : 'Shift+Ctrl+S'
            },
            { 
                label: 'Close',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    main.app.quit();
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            { 
                label: 'All Missions                      ',
                accelerator: process.platform == 'darwin' ? 'Command+A' : 'Ctrl+A',
                click(){
                    main.mainWindow.webContents.send('open:allMissions', "all-missions");
                    //allMissions.allMissionsWindow();
                }
            },
            {
                label: 'Last Mission                      ',
                accelerator: process.platform == 'darwin' ? 'Command+L' : 'Ctrl+L'
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'User Manual                       ',
                accelerator: process.platform == 'darwin' ? 'Command+U' : 'Ctrl+U'
            },
            {
                label: 'Feedback                          ',
                accelerator: process.platform == 'darwin' ? 'Command+F' : 'Ctrl+F'
            }
        ]
    }
];

// Add developer tools item in menu if not in production
if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push(
        {
            label: 'DevTools',
            submenu: [
                {
                    label: 'Toggle DevTools',
                    accelerator: process.platform == 'darwin'? 'Command+I' : 'Ctrl+I',
                    click(item, focusedWindow){
                       focusedWindow.toggleDevTools();
                    }
                }
            ]
        });
}

module.exports = mainMenuTemplate;