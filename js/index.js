let ancre = document.querySelector("section");
let template = document.querySelectorAll(".card")[1]
let copies = 4


for (let i=0; i<copies; i++) {
    let clone = template.cloneNode("true");
    ancre.appendChild(clone);
}

(async () => {

    const url = '/post';
    const posts = await fetch(url)
        .then(response => response.json())
        .then(json => createPosts(json))
        .catch(response => "error");
})();

function createPosts(posts) {
    for(let post of posts) {
        createPost(post);
    }
    document.querySelector("#item-template").remove();
}

function createPost(item) {
    console.log(item);
    let itemTemplate = document.querySelector("#item-template");
    let tableClone = itemTemplate.cloneNode(true)

    tableClone.removeAttribute('id');
    // tableClone.getElementsByClassName("item-link")[0].setAttribute("href", "/");
    tableClone.querySelector(".message").innerHTML = item.message;
    tableClone.querySelector(".date").innerHTML = "at: "+item.createdAt;
    tableClone.querySelector(".author").innerHTML = "by: "+item.user.email;
    // tableClone.getElementsByClassName("img")[0].setAttribute("src", "/");

    document.getElementById("item-list").appendChild(tableClone);
}