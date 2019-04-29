var map;
var draw;
var drawFeatureID = "";
var newDrawFeature = false;
var featureToZoneMap = [];
var target = false;
var start = false;
var marker = null;
var startMarker = null;
var currLocation = null;
var markers = [];
var points1 = [];
var points2 = [];

var droneData1 = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "LineString",
    coordinates: points1
  }
};
var droneData2 = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "LineString",
    coordinates: points2
  }
};

var drone;
ipcRenderer.on("create:newMission", (event, mission_name) => {
  drone = require("../controllers/drone");
  drone.connect1(4);
  setTimeout(() => {
    drone.connect2(6);
  }, 500);

  document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById("generatePath").onclick(getPoints);
  });

  fetch("../views/mission.html")
    .then(res => res.text())
    .then(res => {
      results.innerHTML = res;

      map = new mapboxgl.Map({
        container: "map", // container id
        style: "http://localhost:8080/styles/osm-bright/style.json", //hosted style id
        zoom: 10,
        center: [-110.826, 32.239]
      });
      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      map.on("mousemove", function(e) {
        document.getElementById("info").innerHTML =
          "Lng: " + e.lngLat["lng"] + ", " + "Lat: " + e.lngLat["lat"];
      });

      // add draw
      draw = new MapboxDraw({
        // this is used to allow for custom properties for styling
        // it appends the word "user_" to the property
        userProperties: true,
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true
        },
        styles: [
          // default themes provided by MB Draw
          // default themes provided by MB Draw
          // default themes provided by MB Draw
          // default themes provided by MB Draw

          {
            id: "gl-draw-polygon-fill-inactive",
            type: "fill",
            filter: [
              "all",
              ["==", "active", "false"],
              ["==", "$type", "Polygon"],
              ["!=", "mode", "static"]
            ],
            paint: {
              "fill-color": "#3bb2d0",
              "fill-outline-color": "#3bb2d0",
              "fill-opacity": 0.1
            }
          },
          {
            id: "gl-draw-polygon-fill-active",
            type: "fill",
            filter: [
              "all",
              ["==", "active", "true"],
              ["==", "$type", "Polygon"]
            ],
            paint: {
              "fill-color": "#fbb03b",
              "fill-outline-color": "#fbb03b",
              "fill-opacity": 0.1
            }
          },
          {
            id: "gl-draw-polygon-midpoint",
            type: "circle",
            filter: [
              "all",
              ["==", "$type", "Point"],
              ["==", "meta", "midpoint"]
            ],
            paint: {
              "circle-radius": 3,
              "circle-color": "#fbb03b"
            }
          },
          {
            id: "gl-draw-polygon-stroke-inactive",
            type: "line",
            filter: [
              "all",
              ["==", "active", "false"],
              ["==", "$type", "Polygon"],
              ["!=", "mode", "static"]
            ],
            layout: {
              "line-cap": "round",
              "line-join": "round"
            },
            paint: {
              "line-color": "#3bb2d0",
              "line-width": 2
            }
          },
          {
            id: "gl-draw-polygon-stroke-active",
            type: "line",
            filter: [
              "all",
              ["==", "active", "true"],
              ["==", "$type", "Polygon"]
            ],
            layout: {
              "line-cap": "round",
              "line-join": "round"
            },
            paint: {
              "line-color": "#fbb03b",
              "line-dasharray": [0.2, 2],
              "line-width": 2
            }
          },
          {
            id: "gl-draw-line-inactive",
            type: "line",
            filter: [
              "all",
              ["==", "active", "false"],
              ["==", "$type", "LineString"],
              ["!=", "mode", "static"]
            ],
            layout: {
              "line-cap": "round",
              "line-join": "round"
            },
            paint: {
              "line-color": "#3bb2d0",
              "line-width": 2
            }
          },
          {
            id: "gl-draw-line-active",
            type: "line",
            filter: [
              "all",
              ["==", "$type", "LineString"],
              ["==", "active", "true"]
            ],
            layout: {
              "line-cap": "round",
              "line-join": "round"
            },
            paint: {
              "line-color": "#fbb03b",
              "line-dasharray": [0.2, 2],
              "line-width": 2
            }
          },
          {
            id: "gl-draw-polygon-and-line-vertex-stroke-inactive",
            type: "circle",
            filter: [
              "all",
              ["==", "meta", "vertex"],
              ["==", "$type", "Point"],
              ["!=", "mode", "static"]
            ],
            paint: {
              "circle-radius": 5,
              "circle-color": "#fff"
            }
          },
          {
            id: "gl-draw-polygon-and-line-vertex-inactive",
            type: "circle",
            filter: [
              "all",
              ["==", "meta", "vertex"],
              ["==", "$type", "Point"],
              ["!=", "mode", "static"]
            ],
            paint: {
              "circle-radius": 3,
              "circle-color": "#fbb03b"
            }
          },
          {
            id: "gl-draw-point-point-stroke-inactive",
            type: "circle",
            filter: [
              "all",
              ["==", "active", "false"],
              ["==", "$type", "Point"],
              ["==", "meta", "feature"],
              ["!=", "mode", "static"]
            ],
            paint: {
              "circle-radius": 5,
              "circle-opacity": 1,
              "circle-color": "#fff"
            }
          },
          {
            id: "gl-draw-point-inactive",
            type: "circle",
            filter: [
              "all",
              ["==", "active", "false"],
              ["==", "$type", "Point"],
              ["==", "meta", "feature"],
              ["!=", "mode", "static"]
            ],
            paint: {
              "circle-radius": 3,
              "circle-color": "#3bb2d0"
            }
          },
          {
            id: "gl-draw-point-stroke-active",
            type: "circle",
            filter: [
              "all",
              ["==", "$type", "Point"],
              ["==", "active", "true"],
              ["!=", "meta", "midpoint"]
            ],
            paint: {
              "circle-radius": 7,
              "circle-color": "#fff"
            }
          },
          {
            id: "gl-draw-point-active",
            type: "circle",
            filter: [
              "all",
              ["==", "$type", "Point"],
              ["!=", "meta", "midpoint"],
              ["==", "active", "true"]
            ],
            paint: {
              "circle-radius": 5,
              "circle-color": "#fbb03b"
            }
          },
          {
            id: "gl-draw-polygon-fill-static",
            type: "fill",
            filter: [
              "all",
              ["==", "mode", "static"],
              ["==", "$type", "Polygon"]
            ],
            paint: {
              "fill-color": "#404040",
              "fill-outline-color": "#404040",
              "fill-opacity": 0.1
            }
          },
          {
            id: "gl-draw-polygon-stroke-static",
            type: "line",
            filter: [
              "all",
              ["==", "mode", "static"],
              ["==", "$type", "Polygon"]
            ],
            layout: {
              "line-cap": "round",
              "line-join": "round"
            },
            paint: {
              "line-color": "#404040",
              "line-width": 2
            }
          },
          {
            id: "gl-draw-line-static",
            type: "line",
            filter: [
              "all",
              ["==", "mode", "static"],
              ["==", "$type", "LineString"]
            ],
            layout: {
              "line-cap": "round",
              "line-join": "round"
            },
            paint: {
              "line-color": "#404040",
              "line-width": 2
            }
          },
          {
            id: "gl-draw-point-static",
            type: "circle",
            filter: ["all", ["==", "mode", "static"], ["==", "$type", "Point"]],
            paint: {
              "circle-radius": 5,
              "circle-color": "#404040"
            }
          },

          // end default themes provided by MB Draw
          // end default themes provided by MB Draw
          // end default themes provided by MB Draw
          // end default themes provided by MB Draw

          // new styles for toggling colors
          // new styles for toggling colors
          // new styles for toggling colors
          // new styles for toggling colors

          {
            id: "gl-draw-polygon-color-picker",
            type: "fill",
            filter: [
              "all",
              ["==", "$type", "Polygon"],
              ["has", "user_portColor"]
            ],
            paint: {
              "fill-color": ["get", "user_portColor"],
              "fill-outline-color": ["get", "user_portColor"],
              "fill-opacity": 0.5
            }
          },
          {
            id: "gl-draw-line-color-picker",
            type: "line",
            filter: [
              "all",
              ["==", "$type", "LineString"],
              ["has", "user_portColor"]
            ],
            paint: {
              "line-color": ["get", "user_portColor"],
              "line-width": 2
            }
          },
          {
            id: "gl-draw-point-color-picker",
            type: "circle",
            filter: [
              "all",
              ["==", "$type", "Point"],
              ["has", "user_portColor"]
            ],
            paint: {
              "circle-radius": 6,
              "circle-color": ["get", "user_portColor"]
            }
          }
        ]
      });
      map.on("load", () => {
        map.addSource("drone1", {
          type: "geojson",
          data: droneData1
        });
        map.addSource("drone2", {
          type: "geojson",
          data: droneData2
        });

        // map.addSource("drone1", source1);
        // map.addSource("drone2", source2);

        map.addLayer({
          id: "drone1",
          type: "line",
          source: "drone1",
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#0000FF",
            "line-width": 8
          }
        });

        map.addLayer({
          id: "drone2",
          type: "line",
          source: "drone2",
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#FF0000",
            "line-width": 8
          }
        });
      });

      map.addControl(draw, "top-left");

      /* Event Handlers for Draw Tools */

      map.on("draw.create", function() {
        console.log("create");
        newDrawFeature = true;
      });

      map.on("draw.update", setDrawFeature);

      map.on("draw.selectionchange", setDrawFeature);

      map.on("click", function(e) {
        // console.log(draw.getAll())
        // console.log(featureToZoneMap)
        if (target && !marker) {
          marker = new mapboxgl.Marker({
            draggable: true,
            color: "#32CD32"
          })
            .setLngLat(e.lngLat.toArray())
            .addTo(map);
        }
        if (start && !startMarker) {
          startMarker = new mapboxgl.Marker({
            draggable: true,
            color: "#0000FF"
          })
            .setLngLat(e.lngLat.toArray())
            .addTo(map);
        }

        if (!newDrawFeature) {
          var drawFeatureAtPoint = draw.getFeatureIdsAt(e.point);

          //if another drawFeature is not found - reset drawFeatureID
          drawFeatureID = drawFeatureAtPoint.length
            ? drawFeatureAtPoint[0]
            : "";
        }

        newDrawFeature = false;
      });
    });
});

function getLocation() {
  // currLocation = new mapboxgl.Marker({
  //     draggable: true,
  //     color: '#0000ff'
  // }).setLngLat([-110.95270926947258,32.28794027939384]).addTo(map);
}

//change colors
function setZone(zone) {
  if (zone === "target") {
    target = true;
    start = false;
  }
  if (zone === "start") {
    start = true;
    target = false;
  }

  if (drawFeatureID !== "" && typeof draw === "object") {
    // add whatever colors you want here...
    if (zone === "nofly") {
      draw.setFeatureProperty(drawFeatureID, "portColor", "#ff0000");
      featureToZoneMap[drawFeatureID] = "nofly";
      target = false;
      console.log(target);
    } else if (zone === "restricted") {
      draw.setFeatureProperty(drawFeatureID, "portColor", "#FFA500");
      featureToZoneMap[drawFeatureID] = "restricted";
      target = false;
      console.log(target);
    }

    var feat = draw.get(drawFeatureID);
    draw.add(feat);
  }
}

// callback for draw.update and draw.selectionchange
var setDrawFeature = function(e) {
  console.log("update or change");
  if (e.features.length && e.features[0].type === "Feature") {
    var feat = e.features[0];
    drawFeatureID = feat.id;
  }
};

var getPoints = e => {
  var obj = {
    start: [],
    target: [],
    nofly: [],
    restricted: []
  };
  var arr = draw.getAll();
  // console.log("marker");
  // console.log(marker);

  obj.start = [startMarker._lngLat.lng, startMarker._lngLat.lat];
  obj.target = [marker._lngLat.lng, marker._lngLat.lat];

  let maxLng = -Number.MAX_VALUE;
  let minLng = Number.MAX_VALUE;
  let maxLat = -Number.MAX_VALUE;
  let minLat = Number.MAX_VALUE;

  //expansion so that drones don't approach no flyzones
  arr["features"].forEach(feature => {
    feature.geometry.coordinates[0].forEach(coord => {
      if (parseFloat(coord[0]) > maxLng) {
        maxLng = coord[0];
      }
      if (parseFloat(coord[0]) < minLng) {
        minLng = coord[0];
      }

      if (parseFloat(coord[1]) > maxLat) {
        maxLat = coord[1];
      }

      if (parseFloat(coord[1]) < minLat) {
        minLat = coord[1];
      }
    });
  });

  console.log("maxLng: " + maxLng);
  console.log("minLng: " + minLng);
  console.log("maxLat: " + maxLat);
  console.log("minLat: " + minLat);

  let meanLng = (maxLng + minLng) / 2;
  let meanLat = (maxLat + minLat) / 2;
  console.log("meansLng" + meanLng);
  console.log("meanlat" + meanLat);

  arr["features"].forEach(feature => {
    let currCoords = feature.geometry.coordinates[0];
    feature.geometry.coordinates[0].forEach(coord => {
      // console.log("feature")
      // console.log(coord)
      if (coord[0] < meanLng) coord[0] = parseFloat(coord[0]);
      else coord[0] = parseFloat(coord[0]);

      if (coord[1] < meanLat) coord[1] = parseFloat(coord[1]);
      else coord[1] = parseFloat(coord[1]);
    });

    console.log(currCoords);
    if (featureToZoneMap[feature.id] === "nofly") {
      obj.nofly.push(currCoords);
    } else if (featureToZoneMap[feature.id] === "restricted") {
      obj.restricted.push(currCoords);
    } else {
      console.log(featureToZoneMap[feature.id]);
    }

    //console.log(feature.geometry.coordinates);
  });
  console.log(arr["features"]);
  console.log(featureToZoneMap);

  const fs = require("fs");
  fs.writeFile("./data/droneInput.json", JSON.stringify(obj), function(err) {
    if (err) {
      return console.log(err);
    }
    startAStar();
    console.log("The file was saved!");
  });
  console.log(JSON.stringify(obj));
};

var startAStar = () => {
  //"C:\Users\UA Student\Documents\BAE_SystemsMP\src\aStarAlgorithm\x64\Release\aStarAlgorithm.exe" "C:\Users\UA Student\Documents\BAE_SystemsMP\data\droneInput.json"
  var executablePath =
    "C:\\Users\\UA Student\\Documents\\BAE_SystemsMP\\src\\aStarAlgorithm\\x64\\Release\\aStarAlgorithm.exe";
  var parameters = [
    "C:\\Users\\UA Student\\Documents\\BAE_SystemsMP\\data\\droneInput.json"
  ];

  child(executablePath, parameters, function(err, data) {
    console.log("aStarCalled");
    console.log(err);
    // console.log(data)
    // console.log(data.toString());
    showSolution(data.toString());
  });

  // let command = '"C:\\Users\\UA Student\\Documents\\BAE_SystemsMP\\src\\aStarAlgorithm\\x64\\Release\\aStarAlgorithm.exe" "C:\\Users\\UA Student\\Documents\\BAE_SystemsMP\\data\\\droneInput.json"'

  // exec(command, (err, stdout, stderr) => {
  //     if (err) {
  //         console.log(err);
  //       // node couldn't execute the command
  //       return;
  //     }

  //     // the *entire* stdout and stderr (buffered)
  //     showSolution(stdout);
  //     console.log(`stdout: ${stdout}`);
  //     console.log(`stderr: ${stderr}`);
  //   });
};

var showSolution = json => {
  var paths = JSON.parse(json);
  points1 = paths.drone1Path;
  points2 = paths.drone2Path;

  droneData1 = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: points1
    }
  };

  droneData2 = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: points2
    }
  };
  // console.log(points1);
  // console.log(points2);

  map.getSource("drone1").setData(droneData1);
  map.getSource("drone2").setData(droneData2);

  // obj.forEach((coord) => {
  //     console.log(coord);
  //     markers.push(new mapboxgl.Marker({
  //         draggable: false,
  //         color: '#32CD32'
  //     }).setLngLat(coord).addTo(map));
  // });

  // console.log(obj);
};

var startDrone1 = e => {
  console.log("Starting drone 1");
  drone.load1("drone1.txt");
};
var startDrone2 = e => {
  console.log("Starting drone 2");
  drone.load2("drone2.txt");
};
