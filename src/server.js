const express = require('express');
const path = require('path');

const app = express();

// settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Mongo connection
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/todoapp';
const ObjectID = require('mongodb').ObjectID;

MongoClient.connect(url, (err, database) => {
    console.log('mongodb connected');
    if (err) throw err;

    db = database.db('todoapp');
    Todos = db.collection('todos');

    // start the server
    app.listen(app.get('port'), () => {
        console.log('server on port', app.get('port'));
    });
});

// routes
app.get('/', (req, res, next) => {
    Todos.find({}).toArray((err, todos) => {
        if (err) {
            return console.log(err);
        }
        res.render('index', {
            todos
        });
    });
});

app.post('/todo/add', (req, res, next) => {
    const todo = {
        text: req.body.text,
        body: req.body.body
    };
    Todos.insert(todo, (err, result) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});

app.delete('/todo/delete/:id', (req, res, next) => {
    const query = {_id: ObjectID(req.params.id)};
    Todos.deleteOne(query, (err, response) => {
        if (err) {
            return console.log(err)
        }
        res.sendStatus(200)
    })
});


app.get('/todo/edit/:id', (req, res, next) => {
    const query = {_id: ObjectID(req.params.id)};
    Todos.find(query).next((err, todo) => {
        if (err) {
            return console.log(err);
        }
        res.render('edit', {
            todo
        });
    });
});

app.post('/todo/edit/:id', (req, res, next) => {
    const query = {_id: ObjectID(req.params.id)};

    const todo = {
        text: req.body.text,
        body: req.body.body
    };

    Todos.updateOne(query, {$set: todo}, (err, result) => {
        if (err) {
            return console.log(err)
        }
        res.redirect('/')
    })
});
