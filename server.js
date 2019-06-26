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
let error = ''
let success = ''



request(baseApiUrl + 'films', { json: true }, (err, res, body) => {
    if (err) { return console.log(err) }
    a = body
})

/* configuração da aplicação */

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

startServer()

/* funções */

function startServer(){
    connection.connect((err) => {
        if (err) {
            console.error('error connecting: ' + err.stack)
            return
        }

        console.log('Conexão com o db estabelecida com sucesso')
        console.log(`Conectado com o id: ${connection.threadId}`)

        app.listen(3000, () => {
            console.log('Rodando em localhost:3000')
        })
    })
}


async function queryAll(table){
    return new Promise((resolve) => {
        connection.query(`SELECT * FROM ${table}`, (err, results, fields) => {
            err ? resolve(err) : resolve(results)
        })
    })
}

async function insertUser(table, login, password){
    return new Promise((resolve) => {
        let stmt = 'INSERT INTO ?? (login, password) VALUES (?, ?)'
        let inserts = [table, login, password]
        stmt = mysql.format(stmt, inserts)

        connection.query(stmt, (err, results, fields) => {
            err ? resolve(err) : resolve(results.affectedRows)
        })
    })
}

function endConnection() {
    connection.end()
}

/* execução */

insertUser('usuarios', 'marioooooo', 'owo').then((r) => console.log(r))

queryAll('usuarios').then((r) => { for (let re of r) console.log(re.login, re.password) })

endConnection()
