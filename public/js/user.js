(async () => {

    let url = document.location.search;
    let id = new URLSearchParams(url).get("id");

    const urlUser = urlApi + '/user/' + id;
    // https://stackoverflow.com/questions/34558264/fetch-api-with-cookie
    const posts = await fetch(urlUser, {
        // credentials: "include"
        method: "get",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(json => createUser(json))
        .catch(response => "error");

    const form = document.querySelector("form");
    form.onsubmit = (function (event) {
        editUser(event);
    })
    document.querySelector("#deleteAccount").onclick = (function (event) {
        deleteUser(event);
    })
})();

function createUser(pUser) {
    // console.log(pUser);
    document.querySelector("form").dataset.id = pUser.id;
    document.querySelector("legend").innerHTML = pUser.pseudo;
    document.querySelector("#pseudo").value = pUser.pseudo;
    document.querySelector("#date").value = getDateFr(pUser.createdAt);
    document.querySelector("#email").value = pUser.email;

    if (pUser.isAdmin) {
        document.querySelector("#isAdmin").setAttribute("checked", "");
    } 
    
    // Si ce n'est pas mon compte et que je ne suis pas admin
    if (pUser.id !== user.id && !user.isAdmin) {
        console.log("not you !!!")
        document.querySelector("#pseudo").setAttribute("disabled", "");
        document.querySelector("#email").setAttribute("disabled", "");
        document.querySelector("input[type=submit]").classList.add("hidden");
        document.querySelector("#deleteAccount").classList.add("hidden");
    }
}

function editUser(event) {
    event.preventDefault();
    const form = event.target.closest("form");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log("data", data);
    const id = form.dataset.id;
    fetch(urlApiUser + id, {
        // credentials: "include"
        method: "put",
        // body: JSON.stringify({"message":"hello"}),
        body: JSON.stringify(data),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
        },
    })
        .then(response => response.json())
        .then(json => {
            window.location.reload();
        })
        .catch(response => "error");
}

function deleteUser(event) {
    event.preventDefault();
    const form = document.querySelector("form");
    const id = form.dataset.id;
    fetch(urlApiUser + id, {
        // credentials: "include"
        method: "delete",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
        },
    })
        .then(response => response.json())
        .then(json => {
            logout();
        })
        .catch(response => "error");
}