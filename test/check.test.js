/**
 
* @jest-enviroment node

*/

const { test, expect } = require("@jest/globals");
let axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');
let mysql = require('mysql')

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
let chatId = null
const cleanDBTables = async () =>{
    await testConnection(await connection(), `DELETE from messages WHERE sen = '77777777'`)
    await testConnection(await connection(), `DELETE from messages WHERE sen = '77777778'`)
    let c = await testConnection(await connection(), `select * from chat`)
    chatId = c.length + 100000
    await testConnection(await connection(), `DELETE from chat WHERE user_one_num = '77777777'`)
}
cleanDBTables()
// //testing case title
test('Test login successfuly', async () => {

    // login with user and password to get a token
    let res = await axios.post('http://localhost:3001/api/login', {
        username: 'testUserSen',
        password: '123'
    }
    ).catch(function (e) {

        expect(e.response.status).toBe(401)
    })
    expect(res.status).toBe(200)
})

test('failed to login', async () => {

    // login with user and password to get a token
    let res = await axios.post('http://localhost:3001/api/login', {
        username: 'testUserSen',
        password: '12345'
    }
    ).catch(function (error) {
        expect(error.response.status).toBe(401)

    })
})

test('get friend list', async () => {
    let res = await axios.post('http://localhost:3001/api/login', {
        username: 'testUserSen',
        password: '123'
    }
    ).catch(function (e) {
        expect(e.response.status).toBe(401)
    })
    let token = res.data
    await testConnection(await connection(), `insert into chat (id, user_one_num, user_two_num) values (${chatId}, '77777777', '77777778')`)
    let getdata = await axios.get("http://localhost:3001/api/v1.0/contacts",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch(function (e) {
            expect(e.response.status).toBe(403)
        })
    let info = [getdata.data.contacts[0].name, getdata.data.contacts[0].phoneNum]

    expect(info).toEqual(['testUserRec', '77777778'])
})

test('send message', async () => {

    // login with user and password to get a token
    let res = await axios.post('http://localhost:3001/api/login', {
        username: 'testUserSen',
        password: '123'
    })

    let token = res.data
    expect(res.status).toBe(200)


    let messages = await testConnection(await connection(), `select * from messages where sen = '77777777'`)
    expect(messages.length).toBe(0)

    let chatCounter = await testConnection(await connection(), `select * from chat`)

    let getdata = await axios.post('http://localhost:3001/api/sendMessage', {
        sender: "77777777",
        message: "hello from tester",
        receiver: "77777778",
        cid: chatId,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    // check the db if it got the message
    messages = await testConnection(await connection(), `select * from messages where sen = '77777777'`)
    expect(messages.length).toBe(1)
    expect(messages[0].message).toEqual('hello from tester')
    expect(getdata.status).toBe(200)
})

test('get chat', async () => {
    let res = await axios.post('http://localhost:3001/api/login', {
        username: 'testUserSen',
        password: '123'
    }
    ).catch(function (e) {
        expect(e.response.status).toBe(401)
    })
    let token = res.data

    let getdata = await axios.post('http://localhost:3001/api/getConv', {
        sender: "77777777",
        receiver: "77777778",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    expect(getdata.data.userChat[0].message).toBe('hello from tester')
    cleanDBTables()
})
