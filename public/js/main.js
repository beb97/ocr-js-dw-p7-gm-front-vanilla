const urlApi = "http://192.168.1.12:3000";
const urlFront = "http://192.168.1.12:4200";

(() => {

    const token = localStorage.getItem("token");
    const expires = localStorage.getItem("expires");
    if (!token) {
        // window.location.href = "login.html";
        displayToast({
                message:"Vous n'êtes pas connecté", 
                url:"<a href='login.html'>connectez-vous</a>"
        });
    } else if (isExpired(new Date(expires))) {
        // window.location.href = "login.html";
        displayToast({
            message:"Vous n'êtes plus connecté", 
            url:"<a href='login.html'>connectez-vous</a>"
        });
    }
    // displayToast();

    fetch('nav.html')
        .then(res => res.text())
        .then(text => {
            let anchor = document.querySelector("header");
            anchor.innerHTML = text;
        })
})()

function isExpired(date) {
    const now = Date.now();
    const time = date.getTime();
    // console.log("now: ", now)
    // console.log("date: ", time)
    return time < now;
}

function displayToast(toast) {
    let template = document.querySelector("template#toast");
    let clone = template.content.cloneNode(true);
    let anchre = document.querySelector("#infos");
    clone.querySelector(".toast-message").innerHTML = toast.message;
    if(toast.url) {
        clone.querySelector(".toast-url").innerHTML = toast.url;
    }
    anchre.appendChild(clone);
}

function closeToast(e) {
    console.log("closing");
    e.target.closest(".toast").remove();
}