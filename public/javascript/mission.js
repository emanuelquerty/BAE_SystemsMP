var map;
var draw;
var drawFeatureID = '';
var newDrawFeature = false;
var featureToZoneMap = [];
var target = false;
var marker = null;

ipcRenderer.on("create:newMission", (event, mission_name) => {

    fetch("../views/mission.html")
        .then(res => res.text())
        .then(res => {
            results.innerHTML = res;


            var map = new mapboxgl.Map({
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
                console.log(draw.getAll())
                console.log(featureToZoneMap)
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

