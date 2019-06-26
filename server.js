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

request(baseApiUrl + 'films', { json: true }, (err, res, body) => {
    if (err) { return console.log(err) }
    a = body
})

/* configuração da aplicação */

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))

/* rotas */

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/error', (req, res) => {
    res.render('error.ejs', { msg: error })
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/signup', (req, res) => {
    res.render('signup.ejs')
})

app.post('/createuser', (req, res) => {
    insertUser('usuarios', req.body.login, req.body.password).then((r) => {
        if (r !== 1) {
            console.log('erro')
            error = 'usuario ja existe'
            res.redirect(302, '/error')
        }
    })
})

app.post('/loguser', (req, res) => {
    checkUser('usuarios', req.body.login).then((r) => {
        if (r.length){
            res.render('results', { data: a })
            console.log(r)
        }
        else{
            console.log('erro')
            error = 'usuario inexistente'
            res.redirect(302, '/error')
        }
    })
})



startServer()

/* funções */

function startServer(){
    connection.connect((err) => {
        if (err) {
            console.error('error connecting: ' + err.stack)
            return
        }

        console.log('Conexão com o db estabelecida com sucesso.')
        console.log(`Conectado com o id: ${connection.threadId}.`)

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

async function checkUser(table, login){
    return new Promise((resolve) => {
        let stmt = 'SELECT * FROM ?? WHERE login = ?'
        let inserts = [table, login]
        stmt = mysql.format(stmt, inserts)

        connection.query(stmt, (err, results, fields) => {
            err ? resolve(err) : resolve(results)
        })
    })
}
