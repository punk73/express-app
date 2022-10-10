
const express = require('express');
const TaskController = require('./TaskController');
const UserController = require('./controllers/UserController');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3000;

const dbURI = process.env.dbURI;
// const db = Mongoose
app.use(cors())
app.use(express.urlencoded({extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.json())

//login
app.get('/users', UserController.get)
app.post('/register', UserController.register);
app.post('/login', UserController.login);
app.post('/refresh', UserController.refresh );

app.use((req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];

    if(!token) res.status(401).send({
        success: false,
        message:'access denied'
    });

    jwt.verify(token, process.env.TOKEN , (err, user ) => {
        if(err) {
                res.status(403).send({
                success:false,
                message : 'token invalid',
                error : err
            })
        }

        req.user = user;
        next();
    });

});
//tasks
app.get('/', TaskController.get );
app.post('/', TaskController.post );
app.put('/:id', TaskController.put );
app.delete('/:id', TaskController.delete );



mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connected to db')

    app.listen(port, () => {
        console.log(`app listening on port ${port}`);
    });

}).catch(err => {
    console.log(err, 'error occured')
})


module.exports = app;