"use strict";

// ipcRenderer.on("open:allMissions", (event, filename) => {
// fetch(`../views/${filename}.html`)
//   .then(res => res.text())
//   .then(res => {
//     results.innerHTML = res;

function all_missions_wrapper() {
  const docfrag = document.createDocumentFragment();
  for (let i = 0; i < 40; i++) {
    const mission_container = document.createElement("mission-container");
    mission_container.className = "mission-container";
    if (i % 2 == 0) {
      mission_container.style.background = "rgb(233, 233, 233)";
    }

    const img = document.createElement("img");
    img.className = "mission-image";
    img.src = "../public/images/report.jpg";

    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    p1.className = "mission-name";
    p1.innerHTML = "Mission Name";
    p2.className = "mission-date";
    p2.innerHTML = "Mar 20, 2019 at 3:50PM";

    const mission_details = document.createElement("div");
    mission_details.appendChild(p1);
    mission_details.appendChild(p2);
    mission_details.className = "mission-details";

    mission_container.appendChild(img);
    mission_container.appendChild(mission_details);
    docfrag.appendChild(mission_container);

    mission_container.addEventListener("click", function(e) {
      (function(e) {
        openMissionData();
      })(e);
    });
  }

  const all_missions_wrapper = document.getElementById("all-missions-wrapper");
  all_missions_wrapper.appendChild(docfrag);
  // });
  // });

  function openMissionData() {
    fetch(`../views/mission-data.html`)
      .then(res => res.text())
      .then(res => {
        results.innerHTML = res;
      });
  }
}
