checkIfLogged();

(async () => {

    let url = document.location.search;
    let id = new URLSearchParams(url).get("id");
    let urlGetPosts = urlApi+'/post/'+id;

    console.log(urlGetPosts)
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
    .then(json => createPost(json))
    .catch(response => "error");

    /** COMMENTAIRES */
    const urlComment = urlApi+"/comment";
    const form = document.querySelector("form");
    form.onsubmit = (e => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const token = localStorage.getItem('token');
        fetch(urlComment, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            mode: "cors",
            body: JSON.stringify(data),
        })
        .then(response => {
            if(!response.ok){
                let err = new Error("Commentaire failed : " + response.status );
                throw err;
            }
            return response.json()
        })
        .then(json => {
            console.log(json);
            displayToast({message:"Commentaire ok"});
            // debugger
            let currentUrl = window.location.href;
            window.location.replace(currentUrl);
        })
        .catch(error => displayToast(error))
    })
})();

function createPost(item) {
    console.log(item);
    // clone.querySelector(".card").removeAttribute(id);
    // tableClone.getElementsByClassName("item-link")[0].setAttribute("href", "/");
    document.querySelector("#titre").innerHTML = item.titre;
    document.querySelector("#message").innerHTML = item.message;
    // document.querySelector(".date").innerHTML = timeSince(new Date(item.createdAt)) ;
    document.querySelector("#date").innerHTML = new Date(item.createdAt).toLocaleDateString("fr") ;
    // document.querySelector("#author").innerHTML = "tototot";
    document.querySelector("#author").innerHTML = item.user.pseudo;
    document.querySelector("#postId").value = item.id;
    document.querySelector(".comment-count").innerHTML = item.comments.length;
    // document.querySelector(".author").setAttribute("href", "user.html?user="+item.user.id);
    if (item.comments) { createComments(item.comments); }
}

function createComments(comments) {
    // console.log(comments)
    for(let comment of comments) {
        createComment(comment);
    }
}

function createComment(comment) {
    let ancre = document.querySelector("#commentaires");
    let template = document.querySelector("template#commentaire");
    let clone = template.content.cloneNode("true");

    clone.querySelector(".comment-message").innerHTML = comment.message;
    clone.querySelector(".comment-date").innerHTML = timeSince(new Date(comment.createdAt));
    clone.querySelector(".comment-author").innerHTML = comment.user.pseudo;
    const userLink = "user.html?id="+comment.user.id;
    clone.querySelector("a").setAttribute("href", userLink);

    ancre.appendChild(clone)
    
}

function postComment() {

}