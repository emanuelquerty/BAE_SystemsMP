var map;
var draw;
var drawFeatureID = '';
var newDrawFeature = false;
var featureToZoneMap = [];
var target = false;
var marker = null;
var markers = [];

ipcRenderer.on("create:newMission", (event, mission_name) => {


    document.addEventListener("DOMContentLoaded", function(event) { 
        document.getElementById("generatePath").onclick(getPoints);
        document.getElementById("showSolution").onclick(showSolution);



    });

    fetch("../views/mission.html")
        .then(res => res.text())
        .then(res => {
            results.innerHTML = res;


            map = new mapboxgl.Map({
                container: "map", // container id
                style: 'http://localhost:8080/styles/osm-bright/style.json', //hosted style id
                zoom: 10,
                center: [-110.826, 32.239]
            });
            map.addControl(new mapboxgl.NavigationControl(), 'top-left');

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
                        'id': 'gl-draw-polygon-fill-inactive',
                        'type': 'fill',
                        'filter': ['all', ['==', 'active', 'false'],
                            ['==', '$type', 'Polygon'],
                            ['!=', 'mode', 'static']
                        ],
                        'paint': {
                            'fill-color': '#3bb2d0',
                            'fill-outline-color': '#3bb2d0',
                            'fill-opacity': 0.1
                        }
                    },
                    {
                        'id': 'gl-draw-polygon-fill-active',
                        'type': 'fill',
                        'filter': ['all', ['==', 'active', 'true'],
                            ['==', '$type', 'Polygon']
                        ],
                        'paint': {
                            'fill-color': '#fbb03b',
                            'fill-outline-color': '#fbb03b',
                            'fill-opacity': 0.1
                        }
                    },
                    {
                        'id': 'gl-draw-polygon-midpoint',
                        'type': 'circle',
                        'filter': ['all', ['==', '$type', 'Point'],
                            ['==', 'meta', 'midpoint']
                        ],
                        'paint': {
                            'circle-radius': 3,
                            'circle-color': '#fbb03b'
                        }
                    },
                    {
                        'id': 'gl-draw-polygon-stroke-inactive',
                        'type': 'line',
                        'filter': ['all', ['==', 'active', 'false'],
                            ['==', '$type', 'Polygon'],
                            ['!=', 'mode', 'static']
                        ],
                        'layout': {
                            'line-cap': 'round',
                            'line-join': 'round'
                        },
                        'paint': {
                            'line-color': '#3bb2d0',
                            'line-width': 2
                        }
                    },
                    {
                        'id': 'gl-draw-polygon-stroke-active',
                        'type': 'line',
                        'filter': ['all', ['==', 'active', 'true'],
                            ['==', '$type', 'Polygon']
                        ],
                        'layout': {
                            'line-cap': 'round',
                            'line-join': 'round'
                        },
                        'paint': {
                            'line-color': '#fbb03b',
                            'line-dasharray': [0.2, 2],
                            'line-width': 2
                        }
                    },
                    {
                        'id': 'gl-draw-line-inactive',
                        'type': 'line',
                        'filter': ['all', ['==', 'active', 'false'],
                            ['==', '$type', 'LineString'],
                            ['!=', 'mode', 'static']
                        ],
                        'layout': {
                            'line-cap': 'round',
                            'line-join': 'round'
                        },
                        'paint': {
                            'line-color': '#3bb2d0',
                            'line-width': 2
                        }
                    },
                    {
                        'id': 'gl-draw-line-active',
                        'type': 'line',
                        'filter': ['all', ['==', '$type', 'LineString'],
                            ['==', 'active', 'true']
                        ],
                        'layout': {
                            'line-cap': 'round',
                            'line-join': 'round'
                        },
                        'paint': {
                            'line-color': '#fbb03b',
                            'line-dasharray': [0.2, 2],
                            'line-width': 2
                        }
                    },
                    {
                        'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive',
                        'type': 'circle',
                        'filter': ['all', ['==', 'meta', 'vertex'],
                            ['==', '$type', 'Point'],
                            ['!=', 'mode', 'static']
                        ],
                        'paint': {
                            'circle-radius': 5,
                            'circle-color': '#fff'
                        }
                    },
                    {
                        'id': 'gl-draw-polygon-and-line-vertex-inactive',
                        'type': 'circle',
                        'filter': ['all', ['==', 'meta', 'vertex'],
                            ['==', '$type', 'Point'],
                            ['!=', 'mode', 'static']
                        ],
                        'paint': {
                            'circle-radius': 3,
                            'circle-color': '#fbb03b'
                        }
                    },
                    {
                        'id': 'gl-draw-point-point-stroke-inactive',
                        'type': 'circle',
                        'filter': ['all', ['==', 'active', 'false'],
                            ['==', '$type', 'Point'],
                            ['==', 'meta', 'feature'],
                            ['!=', 'mode', 'static']
                        ],
                        'paint': {
                            'circle-radius': 5,
                            'circle-opacity': 1,
                            'circle-color': '#fff'
                        }
                    },
                    {
                        'id': 'gl-draw-point-inactive',
                        'type': 'circle',
                        'filter': ['all', ['==', 'active', 'false'],
                            ['==', '$type', 'Point'],
                            ['==', 'meta', 'feature'],
                            ['!=', 'mode', 'static']
                        ],
                        'paint': {
                            'circle-radius': 3,
                            'circle-color': '#3bb2d0'
                        }
                    },
                    {
                        'id': 'gl-draw-point-stroke-active',
                        'type': 'circle',
                        'filter': ['all', ['==', '$type', 'Point'],
                            ['==', 'active', 'true'],
                            ['!=', 'meta', 'midpoint']
                        ],
                        'paint': {
                            'circle-radius': 7,
                            'circle-color': '#fff'
                        }
                    },
                    {
                        'id': 'gl-draw-point-active',
                        'type': 'circle',
                        'filter': ['all', ['==', '$type', 'Point'],
                            ['!=', 'meta', 'midpoint'],
                            ['==', 'active', 'true']
                        ],
                        'paint': {
                            'circle-radius': 5,
                            'circle-color': '#fbb03b'
                        }
                    },
                    {
                        'id': 'gl-draw-polygon-fill-static',
                        'type': 'fill',
                        'filter': ['all', ['==', 'mode', 'static'],
                            ['==', '$type', 'Polygon']
                        ],
                        'paint': {
                            'fill-color': '#404040',
                            'fill-outline-color': '#404040',
                            'fill-opacity': 0.1
                        }
                    },
                    {
                        'id': 'gl-draw-polygon-stroke-static',
                        'type': 'line',
                        'filter': ['all', ['==', 'mode', 'static'],
                            ['==', '$type', 'Polygon']
                        ],
                        'layout': {
                            'line-cap': 'round',
                            'line-join': 'round'
                        },
                        'paint': {
                            'line-color': '#404040',
                            'line-width': 2
                        }
                    },
                    {
                        'id': 'gl-draw-line-static',
                        'type': 'line',
                        'filter': ['all', ['==', 'mode', 'static'],
                            ['==', '$type', 'LineString']
                        ],
                        'layout': {
                            'line-cap': 'round',
                            'line-join': 'round'
                        },
                        'paint': {
                            'line-color': '#404040',
                            'line-width': 2
                        }
                    },
                    {
                        'id': 'gl-draw-point-static',
                        'type': 'circle',
                        'filter': ['all', ['==', 'mode', 'static'],
                            ['==', '$type', 'Point']
                        ],
                        'paint': {
                            'circle-radius': 5,
                            'circle-color': '#404040'
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
                        'id': 'gl-draw-polygon-color-picker',
                        'type': 'fill',
                        'filter': ['all', ['==', '$type', 'Polygon'],
                            ['has', 'user_portColor']
                        ],
                        'paint': {
                            'fill-color': ['get', 'user_portColor'],
                            'fill-outline-color': ['get', 'user_portColor'],
                            'fill-opacity': 0.5
                        }
                    },
                    {
                        'id': 'gl-draw-line-color-picker',
                        'type': 'line',
                        'filter': ['all', ['==', '$type', 'LineString'],
                            ['has', 'user_portColor']
                        ],
                        'paint': {
                            'line-color': ['get', 'user_portColor'],
                            'line-width': 2
                        }
                    },
                    {
                        'id': 'gl-draw-point-color-picker',
                        'type': 'circle',
                        'filter': ['all', ['==', '$type', 'Point'],
                            ['has', 'user_portColor']
                        ],
                        'paint': {
                            'circle-radius': 6,
                            'circle-color': ['get', 'user_portColor']
                        }
                    },

                ]
            })

            map.addControl(draw, 'top-left');

            /* Event Handlers for Draw Tools */

            map.on('draw.create', function () {
                console.log("create")
                newDrawFeature = true;
            });

            map.on('draw.update', setDrawFeature);

            map.on('draw.selectionchange', setDrawFeature);

            map.on('click', function (e) {
                // console.log(draw.getAll())
                // console.log(featureToZoneMap)
                if (target && !marker) {
                    marker = new mapboxgl.Marker({
                        draggable: true,
                        color: '#32CD32'
                    }).setLngLat(e.lngLat.toArray()).addTo(map);
                }

                if (!newDrawFeature) {
                    var drawFeatureAtPoint = draw.getFeatureIdsAt(e.point);

                    //if another drawFeature is not found - reset drawFeatureID
                    drawFeatureID = drawFeatureAtPoint.length ? drawFeatureAtPoint[0] : '';
                }

                newDrawFeature = false;

            });
        });


});



//change colors
function setZone(zone) {
    if (zone === 'target') {
        target = true;
        console.log(target)
    }

    if (drawFeatureID !== '' && typeof draw === 'object') {

        // add whatever colors you want here...
        if (zone === 'nofly') {
            draw.setFeatureProperty(drawFeatureID, 'portColor', '#ff0000');
            featureToZoneMap[drawFeatureID] = 'nofly';
            target = false;
            console.log(target)
        } else if (zone === 'restricted') {
            draw.setFeatureProperty(drawFeatureID, 'portColor', '#FFA500');
            featureToZoneMap[drawFeatureID] = 'restricted';
            target = false;
            console.log(target)
        }

        var feat = draw.get(drawFeatureID);
        draw.add(feat)
    }
}

// callback for draw.update and draw.selectionchange
var setDrawFeature = function (e) {
    console.log("update or change")
    if (e.features.length && e.features[0].type === 'Feature') {
        var feat = e.features[0];
        drawFeatureID = feat.id;
    }
}

var getPoints =  (e) => {
    var obj = {
        "start": [-110.92260655557135,32.20918097010039],
        "target": [],
        "nofly": [],
        "restricted": []
    };
    var arr = draw.getAll();
    console.log("marker");
    console.log(marker);
    
    obj.target = [marker._lngLat.lng, marker._lngLat.lat]

    arr["features"].forEach((feature) => {
        if(featureToZoneMap[feature.id] === "nofly" ){
            obj.nofly.push(feature.geometry.coordinates[0])
        }
        else if(featureToZoneMap[feature.id] === "restricted" ){
            obj.restricted.push(feature.geometry.coordinates[0])
        }
        else{
            console.log(featureToZoneMap[feature.id])
        }
    
        //console.log(feature.geometry.coordinates);

    });    
    console.log(arr["features"]);
    console.log(featureToZoneMap);
    console.log(JSON.stringify(obj));


}

var showSolution =  (e) => {
    let string = `[
        [-110.92261,32.209181],
        [-110.9226,32.209191],
        [-110.92259,32.209201],
        [-110.92258,32.209211],
        [-110.92257,32.209221],
        [-110.92256,32.209231],
        [-110.92255,32.209241],
        [-110.92254,32.209251],
        [-110.92253,32.209261],
        [-110.92252,32.209271],
        [-110.92251,32.209281],
        [-110.9225,32.209291],
        [-110.92249,32.209301],
        [-110.92248,32.209311],
        [-110.92247,32.209321],
        [-110.92246,32.209331],
        [-110.92245,32.209341],
        [-110.92244,32.209351],
        [-110.92243,32.209361],
        [-110.92242,32.209371],
        [-110.92241,32.209381],
        [-110.9224,32.209391],
        [-110.92239,32.209401],
        [-110.92238,32.209411],
        [-110.92237,32.209421],
        [-110.92236,32.209431],
        [-110.92235,32.209441],
        [-110.92234,32.209451],
        [-110.92233,32.209461],
        [-110.92232,32.209471],
        [-110.92231,32.209481],
        [-110.9223,32.209491],
        [-110.92229,32.209501],
        [-110.92228,32.209511],
        [-110.92227,32.209521],
        [-110.92226,32.209531],
        [-110.92225,32.209541],
        [-110.92224,32.209551],
        [-110.92223,32.209561],
        [-110.92222,32.209571],
        [-110.92221,32.209581],
        [-110.9222,32.209591],
        [-110.92219,32.209591],
        [-110.92218,32.209591],
        [-110.92217,32.209591],
        [-110.92216,32.209591],
        [-110.92215,32.209591],
        [-110.92214,32.209601],
        [-110.92213,32.209601],
        [-110.92212,32.209601],
        [-110.92211,32.209601],
        [-110.9221,32.209601],
        [-110.92209,32.209601],
        [-110.92208,32.209601],
        [-110.92207,32.209601],
        [-110.92206,32.209601],
        [-110.92205,32.209601],
        [-110.92204,32.209611],
        [-110.92203,32.209611],
        [-110.92202,32.209611],
        [-110.92201,32.209611],
        [-110.922,32.209611],
        [-110.92199,32.209611],
        [-110.92198,32.209611],
        [-110.92197,32.209611],
        [-110.92196,32.209611],
        [-110.92195,32.209611],
        [-110.92194,32.209621],
        [-110.92193,32.209621],
        [-110.92192,32.209621],
        [-110.92191,32.209621],
        [-110.9219,32.209621],
        [-110.92189,32.209621],
        [-110.92188,32.209621],
        [-110.92187,32.209621],
        [-110.92186,32.209621],
        [-110.92185,32.209621],
        [-110.92184,32.209621],
        [-110.92183,32.209631],
        [-110.92182,32.209631],
        [-110.92181,32.209631],
        [-110.9218,32.209631],
        [-110.92179,32.209631],
        [-110.92178,32.209631],
        [-110.92177,32.209631],
        [-110.92176,32.209641],
        [-110.92175,32.209651],
        [-110.92174,32.209661],
        [-110.92174,32.209671],
        [-110.92173,32.209681],
        [-110.92172,32.209691],
        [-110.92171,32.209701],
        [-110.9217,32.209711],
        [-110.9217,32.209721],
        [-110.92169,32.209731],
        [-110.92168,32.209741],
        [-110.92167,32.209751],
        [-110.92166,32.209761],
        [-110.92166,32.209771],
        [-110.92166,32.209781],
        [-110.92166,32.209791],
        [-110.92166,32.209801],
        [-110.92166,32.209811],
        [-110.92166,32.209821],
        [-110.92166,32.209831],
        [-110.92166,32.209841],
        [-110.92166,32.209851],
        [-110.92166,32.209861],
        [-110.92165,32.209871],
        [-110.92165,32.209881],
        [-110.92165,32.209891],
        [-110.92165,32.209901],
        [-110.92165,32.209911],
        [-110.92165,32.209921],
        [-110.92165,32.209931],
        [-110.92165,32.209941],
        [-110.92165,32.209951],
        [-110.92166,32.209961],
        [-110.92167,32.209971],
        [-110.92168,32.209981],
        [-110.92169,32.209991],
        [-110.9217,32.210001],
        [-110.92171,32.210011],
        [-110.92172,32.210021],
        [-110.92173,32.210031],
        [-110.92174,32.210041],
        [-110.92175,32.210051],
        [-110.92176,32.210061],
        [-110.92177,32.210071],
        [-110.92178,32.210081],
        [-110.92179,32.210091],
        [-110.9218,32.210101],
        [-110.92181,32.210111],
        [-110.92182,32.210121],
        [-110.92183,32.210131],
        [-110.92184,32.210141],
        [-110.92185,32.210151],
        [-110.92186,32.210161],
        [-110.92187,32.210171],
        [-110.92188,32.210181],
        [-110.92189,32.210191],
        [-110.9219,32.210201],
        [-110.92191,32.210211],
        [-110.92192,32.210221],
        [-110.92193,32.210231],
        [-110.92194,32.210241],
        [-110.92195,32.210251],
        [-110.92196,32.210261],
        [-110.92197,32.210271],
        [-110.92198,32.210281],
        [-110.92199,32.210291],
        [-110.922,32.210291]]`;
    var arr = JSON.parse(string);
    map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
        "type": "geojson",
        "data": {
        "type": "Feature",
        "properties": {},
        "geometry": {
        "type": "LineString",
        "coordinates": arr
        }
        }
        },
        "layout": {
        "line-join": "round",
        "line-cap": "round"
        },
        "paint": {
        "line-color": "#888",
        "line-width": 8
        }
        });


    // obj.forEach((coord) => {
    //     console.log(coord);
    //     markers.push(new mapboxgl.Marker({
    //         draggable: false,
    //         color: '#32CD32'
    //     }).setLngLat(coord).addTo(map));
    // });
    
    // console.log(obj);
    

}

