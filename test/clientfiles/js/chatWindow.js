let queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
let queries = queryString.split("-");
console.log(queries)
let [, sender, receiver] = queries
let cid = ''
dataBag = {
    sender,
    receiver
}
const getData = () => {
    fetch('/api/getConv', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataBag)
    })
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText)
            }
            return response.json()
        })
        .then(data => {
            accessToken = data
            let listContents = ''
            console.log(typeof data)
            cid = data.cid
            data.userChat.forEach((a) => {
                a.sen === sender ?
                    listContents += `<h3 id='sen'>${a.sen}: ${a.message}</h3>`
                    :
                    listContents += `<h3 id='rec'>${a.sen}: ${a.message}</h3>`

            })
            document.getElementById("messagesWindow").innerHTML = listContents
        })
        .catch(e => {
            console.error(e)
        })
}
getData()
const sendMessage = () => {
    const message = document.getElementById('sendInput')

    fetch('/api/sendMessage', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message.value, sender, receiver, cid })
    })
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText)
            }
            return response.text()
        })
        .then(data => {
            console.log(data)
            getData()
        })
        .catch(e => {
            console.error(e)
        })
}