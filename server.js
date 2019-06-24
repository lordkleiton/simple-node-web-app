const request = require('request')
const express = require('express');
const bodyParser = require('body-parser')
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

app.listen(3000, () => {
    console.log('Rodando em localhost:3000')
})