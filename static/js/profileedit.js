// let payload = localStorage.getItem("payload")
// let payload_parse = JSON.parse(payload);
// let access = localStorage.getItem("access")
// let login_type = payload_parse.login_type

let passwordbutton = document.getElementById("pschange")
passwordbutton.style.display = "block";

if (login_type !== "normal") {
    passwordbutton.style.display = "none";
}