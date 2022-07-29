(() => {
    checkIfLogged();
    
    const form = document.querySelector("form");
    form.onsubmit = (e => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        fetch(urlApiPost, {
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