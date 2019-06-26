const request = require('request')
const express = require('express');
const bodyParser = require('body-parser')
const dbData = require('./config').default
// const mongoClient = require('mongodb').MongoClient
const mysql = require('mysql')
const connection =  mysql.createConnection({
                        host: dbData.host,
                        user: dbData.user,
                        password: dbData.password,
                        database: dbData.database
                    })

const app = express();

let a = ''
const baseApiUrl = 'https://ghibliapi.herokuapp.com/'


request(baseApiUrl + 'films', { json: true }, (err, res, body) => {
    if (err) { return console.log(err) }
    a = body
})

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/results', (req, res) => {
    res.render('results', { data: req.body, a: a })
})

app.post('/signup', (req, res) => {
    res.render('signup.ejs')
})

connection.connect()

connection.query('select * from users', (error, results, fields) => {
    if (error) throw error;
    console.log('user:', results[0].login + ';', 'password:', results[0].password);
})

connection.end()

// console.log('iniciando')

// mongoClient.connect(dbData.uri, {useNewUrlParser: true}, (err, client) => {
//     if (err) return console.log(err)

//     db = client.db(dbData.dbName)

//     let login = 'testeeee'
//     let passwd = 'tessste'

//     let exists = async () => { return await search(login) }

//     exists().then((result) => {
//         if (result.length === 0) {
//             let insere = async () => { await insert(login, passwd) }
//             insere()
//             console.log('inserido')
//         }
//         else {
//             console.log(result)
//         }
//     })

    
// })

app.listen(3000, () => {
    console.log('Rodando em localhost:3000')
})

// async function search(login){
//     return new Promise((resolve) => {
//         db.collection('data').find({ _id: login }, (err, results) => {
//             results.toArray((err, result) => {
//                 resolve(result)
//             })
//         })
//     })
// }

// async function insert(login, passwd){
//     return new Promise((resolve) => {
//         db.collection('data').insertOne({ _id: login, password: passwd })
//     })
// }

// console.log('terminando')
