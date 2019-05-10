# BAE_SystemsMP
A desktop app for controlling a pair of UAV'S for humanitarian missions.

Technologies used: NodeJS, ElectronJS, Javascript, Web RTC, CSS, HTML, Amazon AWS, MavProxy, OpenMapStreets, tileserver-gl-light, among others;

# How to start application
1. npm install to make sure all dependencies installed
2. Download raw Open Street Map Vector Tiles from this link and place in main directory of project
https://openmaptiles.com/downloads/north-america/us/arizona/
3. Run 'tileserver-gl-light' with the raw file to start the map server. This should work when in the main directory
```tileserver-gl-light 2017-07-03_us_arizona.mbtiles```
4. Run npm start to start application
