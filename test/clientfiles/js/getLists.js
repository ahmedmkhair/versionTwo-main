fetch('/api/v1.0/contacts', {
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')
    }
})
    .then(response => {
        if (!response.ok) {
            throw Error(response.statusText)
        }
        return response.json()
    })
    .then(data => {
        let listContents = ''
        data.contacts.forEach((a) => {
            listContents += `<a class="data" href='./chatWindow.html?data=-${data.sender}-${a.phoneNum}'>${a.name}, ${a.phoneNum}</a><br>`
            console.log("this is list " + listContents)
            console.log("this is the data " + data)
        })
        document.getElementById("user-list").innerHTML = listContents
        if (data.userType === 'admin') {
            let listContentsForAdmin = '<h2>All User\'s chats</h2> <ul id=\'admin-watch-list\'>'
            data.adminWatchList.forEach((a) => {
                listContentsForAdmin += `<a class="allchat href='./adminChatWindow.html?data=-${a.user_two_num}-${a.user_one_num}'>${a.user_two_num}, ${a.user_one_num}</a><br>`
            })
            listContentsForAdmin += '</ul>'
            document.body.innerHTML += listContentsForAdmin
        }
    })
    .catch((e) => {
        window.location.href = "./index.html";
    })