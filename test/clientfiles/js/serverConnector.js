function doLogin() {
    let un = document.getElementById("username").value
    let pw = document.getElementById("password").value

 loginRequest = {
        username: un,
        password: pw
    }

    fetch('/api/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginRequest)
    })
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText)
            }
            return response.text()
        })
        .then(data => {
            sessionStorage.setItem('accessToken', data)
            window.location.href = "./usersList.html";
        })
        .catch(e => {
            alert("Error logging in")
        })
}

function doLogout() {
    sessionStorage.clear()
    window.location.href = "./usersList.html";
}