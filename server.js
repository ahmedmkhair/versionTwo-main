let express = require("express")
let mysql = require('mysql')
let app = express()
var bcrypt = require('bcryptjs');
let port = 3000

let basePath = '/api/v1.0'
app.use(express.static('clientfiles'))
app.use(express.json())
const jwt = require('jsonwebtoken')

let appSecret = 'dsjkfnnkmdsbncjhbskjyfbckjsbjfdbgsjdbcjhsdgcjksdc'



const connection = async () => new Promise(
    (resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'ahmed',
            password: '12class34',
            database: 'etdb'
        });
        connection.connect(error => {
            if (error) {
                reject(error);
                return;
            }
            resolve(connection);
        })
    }
);
const query = async (conn, q, params) => new Promise(
    (resolve, reject) => {
        const handler = (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        }
        conn.query(q, params, handler);
    }
);
const testConnection = async (con, qu) => {
    let result = await query(con, qu)
    con.end()
    return result
}

const userVerification = (authToken) => {
    try {
        let user = jwt.verify(authToken, appSecret)
        return [200, user.type, user.num]
    }
    catch (e) {
        return [403]
    }
}

async function getAllforAdmin(u) {
    let co = await connection()
    return await testConnection(co, `select * from chat where user_one_num != '` + u + `' and user_two_num != '` + u + `'`)
}
async function retrieveByNum(num) {
    let co = await connection()
    let q = await testConnection(co, `select * from users where phoneNum = '${num}'`)
    return q[0]
}

app.get(basePath + '/contacts', async (req, res) => {
    let token = req.headers['authorization'].split(" ")[1]
    let user = userVerification(token)
    let co = await connection()
    let userChat = await testConnection(co, `select * from chat where user_one_num = '` + user[2] + `' or user_two_num = '` + user[2] + `'`)
    let contacts = []

    // this use local
    await Promise.all(
        userChat.map(async row => {
            if (row.user_one_num !== user[2]) {
                contacts.push(await retrieveByNum(row.user_one_num))
            } else {
                contacts.push(await retrieveByNum(row.user_two_num))
            }

        })
    )

    let adminWatchList = []
    if (user[1] === 'admin') {
        adminWatchList = await getAllforAdmin(user[2])
    }

    res.status(user[0])
    if (user[0] === 200)
        res.send({ contacts, sender: user[2], adminWatchList, userType: user[1] })
    else res.send('Invalid !!')
})

app.post('/api/login', async (req, res) => {
    let co = await connection()

    let item = await testConnection(co, `select * from users where name = '${req.body.username}'`)

    let hash = item.length > 0 && item[0].password

    bcrypt.compare(req.body.password, hash, async function (err, result) {
        if (result) {
            item = item[0]
            let userData = {
                name: req.body.username,
                num: item.phoneNum,
                type: item.role,
            }
            console.log(userData)
            let token = jwt.sign(userData, appSecret)
            res.send(token)
        }
        else {
            res.status(401)
            res.send('User invalid')
        }
    })
})


app.post('/api/getConv', async (req, res) => {

    let co = await connection()
    let userChat = await testConnection(co, `
        SELECT message, sen, rec,chat.id
        from messages, chat 
        WHERE chat.id = messages.chat_id 
        AND chat.user_one_num in ('${req.body.sender}' , '${req.body.receiver}') 
        AND chat.user_two_num in ('${req.body.sender}' , '${req.body.receiver}') 
        ORDER BY messages.id 
    `)
    res.send({ userChat, cid: userChat[0].id })
})

app.post('/api/sendMessage', async (req, res) => {
    let co = await connection()
    await testConnection(co, `
        Insert Into messages(chat_id, sen, message,rec) values
        (
             ${req.body.cid},
            '${req.body.sender}',
            '${req.body.message}',
            '${req.body.receiver}'
        )
    `)
    res.send('ok, all fine till now')
})

app.listen(port, () => {
    console.log("The application has started")
})

