const urlGetPosts = urlApi+'/post';

// for (let i=0; i<copies; i++) {
//     let clone = template.cloneNode("true");
//     ancre.appendChild(clone);
// }

(async () => {

    // https://stackoverflow.com/questions/34558264/fetch-api-with-cookie
    const token = localStorage.getItem('token');
    const posts = await fetch(urlGetPosts, {
        // credentials: "include"
        method: "get",
        headers: {
             Authorization: `Bearer ${token}` 
        }
    })
    .then(response => response.json())
    .then(json => createPosts(json))
    .catch(response => "error");
})();

function createPosts(posts) {
    console.log(posts)
    for(let post of posts) {
        createPost(post);
    }
    // document.querySelector("#item-template").remove();
}

function createPost(item) {
    let ancre = document.querySelector("section");
    let template = document.querySelector("template#card");
    let clone = template.content.cloneNode("true");
    
    // clone.querySelector(".card").removeAttribute(id);
    // tableClone.getElementsByClassName("item-link")[0].setAttribute("href", "/");
    clone.querySelector("h2").innerHTML = item.titre;
    // clone.querySelector(".message").innerHTML = item.message;
    clone.querySelector(".date").innerHTML = new Date(item.createdAt).toLocaleDateString("fr") ;
    clone.querySelector(".author").innerHTML = item.user.email;
    clone.querySelector(".author").setAttribute("href", "user.html?user="+item.user.id);
    // tableClone.getElementsByClassName("img")[0].setAttribute("src", "/");

    // document.getElementById("item-list").appendChild(tableClone);
    ancre.appendChild(clone);
}