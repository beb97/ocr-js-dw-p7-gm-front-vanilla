(() => {
    const form = document.querySelector("form");

    // displayToast({
    //     message:"Vous n'avez pas de compte ?", 
    //     url:"<a href='signup.html'>inscrivez-vous</a>",
    //     color: "#e9eef6"
    // });

    form.onsubmit = (e => {
        e.preventDefault();
        const formData = new FormData(form);

        fetch(urlApiUserLogin, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
            },
            // credentials: "include",
            mode: "cors",
            body: JSON.stringify(Object.fromEntries(formData)),
        })
        .then(response => {
            // displayToast("response");
            if(!response.ok){
                let err = new Error("Login failed : " + response.status );
                // debugger
                // err.response = response;
                throw err;
            }
            return response.json()
        })
        .then(json => {
            console.log(json);
            displayToast({message:"login ok"});
            localStorage.setItem("expires", json.expires)
            let user = {
                token : json.token,
                pseudo : json.pseudo,
                id : json.id,
                isAdmin : json.isAdmin
            }
            localStorage.setItem("user", JSON.stringify(user));

            // debugger
            window.location.href = "index.html";
        })
        .catch(error => displayToast(error))
    })
})()