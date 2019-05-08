function change_screen_mode(e) {
  let header = document.getElementById("main-header");
  let left_side_container = document.getElementById("left-side-container");
  let right_side_container = document.getElementById("right-side-container");
  let right_side_container_results = document.getElementById(
    "right-side-container__results"
  );

  let links = document.getElementsByClassName("link");
  let dark_theme_description = document.getElementById(
    "dark-theme-description"
  );

  let toggle_btn = e.target;
  let description_name = document.getElementsByClassName("description-name");
  let description_date = document.getElementsByClassName("description-date");
  let all_missions_wrapper = document.getElementById("all-missions-wrapper");

  if (toggle_btn.innerHTML == "toggle_on") {
    // alert("screen mode changed to drakula");
    header.style.backgroundColor = "#363838";
    header.style.borderBottom = "none";
    dark_theme_description.style.color = "#aaa";
    left_side_container.style.backgroundColor = "#2e3131";
    document.body.style.backgroundColor = "#222";
    var p_matches = document.querySelectorAll("p");

    for (let p of p_matches) {
      p.style.color = "#888";
    }

    for (let link of links) {
      link.style.color = "#999";
    }
    toggle_btn.style.color = "#fff";
  } else {
    // alert("screen mode changed to white mode");
    header.style.backgroundColor = "#bec2c7";
    header.style.borderBottom = "1px solid #b7bdc5";
    dark_theme_description.style.color = "#222";
    left_side_container.style.backgroundColor = "#d0d5da";
    document.body.style.backgroundColor = "#fff";
    var p_matches = document.querySelectorAll("p");

    for (let p of p_matches) {
      p.style.color = "#000";
    }

    for (let link of links) {
      link.style.color = "rgb(68, 68, 68)";
    }
    toggle_btn.style.color = "rgb(68, 68, 68)";
  }
}
