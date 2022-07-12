(() => {
    const form = document.querySelector("form");
    const urlLogin = urlApi+"/user/login";
    // const base_url = window.location.origin;
    // const host = window.location.host;
    // const href = window.location.href;
    // const base_url = href.substring(0, href.lastIndexOf("/"));
    // debugger
    form.onsubmit = (e => {
        e.preventDefault();
        const formData = new FormData(form);
        // console.log([...formData])

        fetch(urlLogin, {
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
            localStorage.setItem("token", json.token)
            localStorage.setItem("user", json.id)
            // debugger
            window.location.href = "index.html";
        })
        .catch(error => displayToast(error))
    })
})()