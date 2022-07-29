checkIfLogged();

(async () => {

    let url = document.location.search;
    let id = new URLSearchParams(url).get("id");
    let urlGetPosts = urlApiPost + id;

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

    const postForm = document.querySelector("#post-form");
    postForm.onsubmit = (function (event) {
        editPost(event);
    })

    /** COMMENTAIRES */
    const commentForm = document.querySelector("#comment-form");
    commentForm.onsubmit = (function (event) {
        addComment(event);
    })
})();

function createPost(item) {
    console.log(item);
    // clone.querySelector(".card").removeAttribute(id);
    // tableClone.getElementsByClassName("item-link")[0].setAttribute("href", "/");
    document.querySelector("form").dataset.id = item.id;
    document.querySelector("#titre").innerHTML = item.titre;
    document.querySelector("#titre-input").value = item.titre;
    document.querySelector("#post").innerHTML = item.message;
    document.querySelector("#post-input").value = item.message;
    // document.querySelector(".date").innerHTML = timeSince(new Date(item.createdAt)) ;
    document.querySelector("#date").innerHTML = new Date(item.createdAt).toLocaleDateString("fr");
    // document.querySelector("#author").innerHTML = "tototot";
    document.querySelector("#author").innerHTML = item.user.pseudo;

    const userLink = "user.html?id=" + item.user.id;
    document.querySelector("#author").setAttribute("href", userLink);

    document.querySelector("#postId").value = item.id;
    document.querySelector("#like-count").innerHTML = item.likes.length;
    document.querySelector(".comment-count").innerHTML = item.comments.length;
    let likeList = item.likes.reduce((acc, c) => { return acc + `${c.user.pseudo} <br/>`}, "");
    document.querySelector("#like-list").innerHTML = likeList;
    document.querySelectorAll("[data-hidden-when=not-owner]").forEach(element => {
        if (!isOwner(item.user.id)) { element.classList.add("hidden") };
    })

    document.querySelector(".post-edit").addEventListener("click", function (event) {
        openPost(event);
    });

    document.querySelector(".post-delete").addEventListener("click", function (event) {
        deletePost(event);
    });


    const likeWrapper = document.querySelector("#like-wrapper");

    let userId = parseInt(user.id);
    let postIsAlreadyLiked = isPostAlreadyLiked(userId, item.likes)

    if (postIsAlreadyLiked) {
        likeWrapper.addEventListener("click", function (event) {
            unlikePost(event);
        });
        likeWrapper.dataset.liked = "true";
    } else {
        likeWrapper.addEventListener("click", function (event) {
            likePost(event);
        });
    }

    // document.querySelector(".author").setAttribute("href", "user.html?user="+item.user.id);
    if (item.comments) { createComments(item.comments); }

}

function isPostAlreadyLiked(userId, likes) {
    let res = likes.filter(like => {
        return like.user.id === userId
    }).length > 0;
    console.log("already liked : ", res);
    return res;
}

function createComments(comments) {
    // console.log(comments)
    for (let comment of comments) {
        createComment(comment);
    }
}

function createComment(comment) {
    let ancre = document.querySelector("#commentaires");
    let template = document.querySelector("template#commentaire");
    let clone = template.content.cloneNode("true");

    clone.querySelector(".comment-message").innerHTML = comment.message;
    clone.querySelector(".comment-message-input").value = comment.message;
    clone.querySelector("form").dataset.id = comment.id;
    // clone.querySelector(".comment-id").value = comment.id;
    clone.querySelector(".comment-date").innerHTML = timeSince(new Date(comment.createdAt));
    clone.querySelector(".comment-author").innerHTML = comment.user.pseudo;
    const userLink = "user.html?id=" + comment.user.id;
    clone.querySelector("a").setAttribute("href", userLink);

    clone.querySelector(".comment-delete").dataset.id = comment.id;
    clone.querySelector(".comment-delete").addEventListener("click", function (event) {
        deleteComment(event);
    });
    clone.querySelector(".comment-edit").addEventListener("click", function (event) {
        openComment(event);
    });
    clone.querySelector("form").addEventListener("submit", function (event) {
        editComment(event);
    });

    clone.querySelectorAll("[data-hidden-when=not-owner]").forEach(element => {
        if (!isOwner(comment.user.id)) { element.classList.add("hidden") };
    })

    ancre.appendChild(clone)
}

function addComment(e) {
    e.preventDefault();
    const form = e.target.closest("form");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    fetch(urlApiComment, {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`
        },
        mode: "cors",
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                let err = new Error("Commentaire failed : " + response.status);
                throw err;
            }
            return response.json()
        })
        .then(json => {
            console.log(json);
            displayToast({ message: "Commentaire ok" });
            // debugger
            let currentUrl = window.location.href;
            window.location.replace(currentUrl);
        })
        .catch(error => displayToast(error))
}

function deleteComment(event) {
    let commentId = event.target.closest(".comment-delete").dataset.id;
    fetch(urlApiComment + commentId, {
        // credentials: "include"
        method: "delete",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(json => {
            window.location.reload();
        })
        .catch(response => "error");
}

function editComment(event) {
    event.preventDefault();
    const form = event.target.closest("form");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log("data", data);
    const commentId = form.dataset.id;
    fetch(urlApiComment + commentId, {
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

function openComment(event) {
    document.querySelectorAll(".comment-message-input-wrapper").forEach((el) => {
        el.classList.add("hidden");
        el.setAttribute("disabled", "");
    })
    document.querySelectorAll(".comment-message").forEach((el) => {
        el.classList.remove("hidden");
    })
    // debugger
    event.target.closest(".commentaire").querySelector(".comment-message").classList.add("hidden");
    let input = event.target.closest(".commentaire").querySelector(".comment-message-input");
    input.removeAttribute("disabled")
    // input.setAttribute("size", input.value.length);
    event.target.closest(".commentaire").querySelector(".comment-message-input-wrapper").classList.remove("hidden");
}

function editPost(event) {
    event.preventDefault();
    const form = event.target.closest("form");
    const fieldset = event.target.closest("fieldset");
    const formData = new FormData(form);
    let data = Object.fromEntries(formData);
    console.log("data", data);
    const postId = form.dataset.id;

    data.titre = fieldset.querySelector("#titre-input").value;

    fetch(urlApiPost + postId, {
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

function deletePost(event) {
    let postId = event.target.closest("fieldset").querySelector("form").dataset.id;
    fetch(urlApiPost + postId, {
        // credentials: "include"
        method: "delete",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(json => {
            window.location.href = "index.html";
        })
        .catch(response => "error");
}

function likePost(event) {
    let postId = event.target.closest("fieldset").querySelector("form").dataset.id;
    fetch(urlApiPost + postId + "/like", {
        // credentials: "include"
        method: "post",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(json => {
            window.location.reload();
        })
        .catch(response => "error");
}


function unlikePost(event) {
    let postId = event.target.closest("fieldset").querySelector("form").dataset.id;
    fetch(urlApiPost + postId + "/like", {
        // credentials: "include"
        method: "delete",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(json => {
            window.location.reload();
        })
        .catch(response => "error");
}

function openPost(event) {

    let blockPost = event.target.closest("fieldset");
    let isEditing = (blockPost.dataset.isEditing === 'true');
    // debugger

    isEditing = !isEditing
    blockPost.dataset.isEditing = isEditing;


    blockPost.querySelectorAll("[data-hidden-when=editing]").forEach(element => {
        if (isEditing) {
            element.classList.add("hidden")
        } else {
            element.classList.remove("hidden");
        }
    })

    blockPost.querySelectorAll("[data-hidden-when=not-editing]").forEach(element => {
        if (!isEditing) {
            element.classList.add("hidden")
        } else {
            element.classList.remove("hidden");
        }
    })
    // input.setAttribute("size", input.value.length);
    // event.target.closest(".commentaire").querySelector(".comment-message-input-wrapper").classList.remove("hidden");
}