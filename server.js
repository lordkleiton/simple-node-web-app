require("dotenv-safe").load()
const jwt = require('jsonwebtoken')
const request = require('request')
const express = require('express');
const bodyParser = require('body-parser')
const dbData = require('./config').default
const mysql = require('mysql')
const connection =  mysql.createConnection({
                        host: dbData.host,
                        user: dbData.user,
                        password: dbData.password,
                        database: dbData.database
                    })

const app = express()
const Cookies = require('cookies')
const cookeys = ['ghibli studios']


let a = ''
const baseApiUrl = 'https://ghibliapi.herokuapp.com/'
let error = ''

request(baseApiUrl + 'films', { json: true }, (err, res, body) => {
    if (err) { return console.log(err) }
    a = body
})

/* configuração da aplicação */

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/css',express.static(__dirname +'/assets/css'));

/* rotas */

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/error', (req, res) => {
    res.render('error.ejs', { msg: error })
    error = ''
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/signup', (req, res) => {
    res.render('signup.ejs')
})

app.post('/createuser', (req, res) => {
    insertUser('users', req.body.login, req.body.password).then((r) => {
        if (r !== 1) {
            console.log('erro')
            error = 'usuario ja existe'
            res.redirect(302, '/error')
        }
        else{
            res.render('results', { data: a})
        }
    })
})

app.post('/loguser', (req, res, next) => {
    checkUser('users', req.body.login, req.body.password).then((r) => {
        if (r.length){
            const id = req.body.login
            let token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: 600
            })

            let cookies = new Cookies(req, res, { keys: cookeys })

            cookies.set('tkn', token, { signed: true, maxAge: 3000 })

            console.log(token)
            console.log(cookies.get('tkn', { signed: true} ))

            res.render('results', { data: a })
        }
        else{
            console.log('erro')
            error = 'Não encontrado. Verifique novamente seu login e senha ou cadastre-se'
            res.redirect(302, '/error')
        }
    }, verifyJWT)
})

app.get('*', (req, res) => {
    res.render('404.ejs')
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

async function checkUser(table, login, password){
    return new Promise((resolve) => {
        let stmt = 'SELECT * FROM ?? WHERE login = ? AND password = ?'
        let inserts = [table, login, password]
        stmt = mysql.format(stmt, inserts)

        connection.query(stmt, (err, results, fields) => {
            err ? resolve(err) : resolve(results)
        })
    })
}

function verifyJWT(req, res, next) {
    let cookies = new Cookies(req, res, { keys: cookeys })
    let token = cookies.get('tkn', { signed: true })

    if (!token){
        erro = 'Faça login para prosseguir.'
        res.redirect(302, '/error')
        return
    } 

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
            error = 'Não foi possível autenticar no sistema.'
            console.log(error)
            res.redirect(302, '/error')
            return
        } 

        req.userId = decoded.id
        next()
    })
}
