(() => {
    const form = document.querySelector("form");

    // displayToast({
    //     message: "Vous avez déjà un compte ?",
    //     url: "<a href='login.html'>connectez-vous</a>",
    //     color: "#e9eef6"
    // });


    form.onsubmit = (e => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        // console.log([...formData])
        fetch(urlApiUserSignup, {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            // credentials: "include",
            mode: "cors",
            body: JSON.stringify(data),
        })
            .then(response => {
                // displayToast("response");
                if (!response.ok) {
                    let err = new Error("User creation failed : " + response.status);
                    // debugger
                    // err.response = response;
                    throw err;
                }
                return response.json()
            })
            .then(json => {
                console.log(json);
                displayToast({ message: "User ok" });
                // debugger
                window.location.href = "login.html";
            })
            .catch(error => displayToast(error))
    })
})()