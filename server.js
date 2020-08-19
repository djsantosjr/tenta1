const express = require('express')
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const app = express()

const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://cadastro1:cad1@cluster0.rki89.mongodb.net/cadastro1?retryWrites=true&w=majority"

MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('contato1')

    app.listen(3000, () => {
        console.log('Server running on port 3000')
    })
})

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })

    })
})

app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Salvo no Banco de Dados')
        res.redirect('/show')
    })
})

app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('data').find(ObjectId(id)).toArray((err, result) => {
        if (err) return res.send(err)
        res.render('edit.ejs', { data: result })
    })
})
.post((req, res) => {
    var id = req.params.id
    var name = req.body.nome
    var cpf = req.body.cpf
    var cep = req.body.cep
    var logradouro = req.body.logradouro
    var bairro = req.body.bairro
    var localidade = req.body.localidade
    var uf = req.value.uf
    db.collection('data').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            cpf: cpf,
            cep: cep,
            logradouro: logradouro,
            bairro: bairro,
            localidade: localidade,
            uf: uf
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado no Bando de dados')
    })
})
app.route('/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result)=> {
        if (err) return res.send(500, err)
        console.log('Deletando do banco de dados!')
        res.redirect('/show')
    })
})