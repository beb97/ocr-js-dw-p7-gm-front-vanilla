(async () => {

    let url = document.location.search;
    let id = new URLSearchParams(url).get("id");

    const urlUser = urlApi+'/user/'+id;
    // https://stackoverflow.com/questions/34558264/fetch-api-with-cookie
    const token = localStorage.getItem('token');
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
})();

function createUser(user) {
    console.log(user);
    document.querySelector("legend").innerHTML = user.pseudo;
    document.querySelector("#pseudo").value = user.pseudo;
    document.querySelector("#date").value = getDateFr(user.createdAt);
    document.querySelector("#email").value = user.email;
}