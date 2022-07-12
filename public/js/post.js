(() => {
    const form = document.querySelector("form");
    const urlPost = urlApi+"/post";
    // const base_url = window.location.origin;
    // const host = window.location.host;
    // const href = window.location.href;
    // const base_url = href.substring(0, href.lastIndexOf("/"));
    // debugger
    form.onsubmit = (e => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        // console.log([...formData])
        const token = localStorage.getItem('token');
        fetch(urlPost, {
            method: 'POST',
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            // credentials: "include",
            mode: "cors",
            body: JSON.stringify(data),
        })
        .then(response => {
            // displayToast("response");
            if(!response.ok){
                let err = new Error("Post failed : " + response.status );
                // debugger
                // err.response = response;
                throw err;
            }
            return response.json()
        })
        .then(json => {
            console.log(json);
            displayToast({message:"Post ok"});
            // debugger
            window.location.href = "index.html";
        })
        .catch(error => displayToast(error))
    })
})()