const urlApi = "http://192.168.1.12:3000";
const urlFront = "http://192.168.1.12:4200";

const urlApiPost = urlApi + "/post/";
const urlApiComment = urlApi + "/comment/";
const urlApiLike = urlApi + "/like/";

const urlApiUser = urlApi + "/user/";
const urlApiUserLogin = urlApiUser + "login";
const urlApiUserSignup = urlApiUser + "signup";

let user = undefined;
let token = undefined;
if(localStorage.getItem('user')) {
  user = JSON.parse(localStorage.getItem('user'));
}
if(localStorage.getItem('token')) {
  token = localStorage.getItem('token');
}

(() => {

  fetch('nav.html')
    .then(res => res.text())
    .then(text => {
      let anchor = document.querySelector("header");
      anchor.innerHTML = text;
      if(isLoggedIn()) {
        document.querySelector("#avatar").innerHTML = user.pseudo.substring(0, 1);
        document.querySelector("#avatar").setAttribute("title", user.pseudo);
        const userLink = "/user.html?id=" + user.id;
        document.querySelector("#nav-user").setAttribute("href", userLink);
      }

      document.querySelectorAll("[data-hidden-when=logedin]").forEach(element => {
        if (isLoggedIn()) { element.classList.add("hidden") };
      })
      document.querySelectorAll("[data-hidden-when=logedoff]").forEach(element => {
        if (!isLoggedIn()) { element.classList.add("hidden") };
      })
    })
})()

function isLoggedIn() {
  return user ? true : false;
}

function isOwner(userId) {
  if (!isLoggedIn) return false;
  if(user.isAdmin) return true;
  return user.id == userId;
}

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("expires");
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

function isExpired(date) {
  const now = Date.now();
  const time = date.getTime();
  // console.log("now: ", now)
  // console.log("date: ", time)
  return time < now;
}

function checkIfLogged() {
  const expires = localStorage.getItem("expires");
  if (!isLoggedIn()) {
    // window.location.href = "login.html";
    displayToast({
      message: "Vous n'êtes pas connecté",
      url: "<a href='login.html'>connectez-vous</a>"
    });
  } else if (isExpired(new Date(expires))) {
    // window.location.href = "login.html";
    displayToast({
      message: "Vous n'êtes plus connecté",
      url: "<a href='login.html'>connectez-vous</a>"
    });
  }
}

function getDateFr(date) {
  return new Date(date).toLocaleDateString("fr")
}

function timeSince(date) {

  const seconds = Math.floor((new Date() - date) / 1000);
  const ilya = "";
  const fin = "";
  // new Date(item.createdAt).toLocaleDateString("fr")

  let interval = seconds / 31536000;
  if (interval > 1) {
    return "en " + new Date(date).getFullYear();
  }
  interval = (seconds / (60 * 60 * 24 * 30));
  if (interval > 1) {
    return "en " + new Date(date).toLocaleString('default', { month: 'long' });;
    //   return "en " + Math.floor(interval) + " mois";
  }
  interval = seconds / (60 * 60 * 24);
  if (interval > 1) {
    return ilya + Math.floor(interval) + " jours" + fin;
  }
  interval = seconds / (60 * 60);
  if (interval > 1) {
    return ilya + Math.floor(interval) + " heures" + fin;
  }
  interval = seconds / (60);
  if (interval > 1) {
    return ilya + Math.floor(interval) + " minutes" + fin;
  }
  // return ilya + Math.floor(seconds) + " secondes";
  return "à l'instant";
}
//   var aDay = 24*60*60*1000;
//   console.log(timeSince(new Date(Date.now()-aDay)));
//   console.log(timeSince(new Date(Date.now()-aDay*2)));

function displayToast(toast) {
  let template = document.querySelector("template#toast");
  let clone = template.content.cloneNode(true);
  let ancre = document.querySelector("#infos");
  clone.querySelector(".toast-message").innerHTML = toast.message;
  if (toast.url) {
    clone.querySelector(".toast-url").innerHTML = toast.url;
  }
  if (toast.color) {
    clone.querySelector(".toast").style.backgroundColor = toast.color;
  }
  ancre.appendChild(clone);
}

function closeToast(e) {
  console.log("closing");
  e.target.closest(".toast").style.opacity = 0;
  setTimeout(function () {
    e.target.closest(".toast").remove();
  }, 500);

}