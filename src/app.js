const express = require("express");
const path = require("path");
const exphbs = require('express-handlebars');
const morgan = require("morgan");
const session = require('express-session');
const nocache = require("nocache");

//Iniciarlizador de Express
const app = express();

//Puerto del servidor
app.set("port", process.env.PORTSERVER);

//Sesion

var sess = {
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized: true
}

app.use(session(sess))
app.use(nocache())


//Configuracion de las vistas
app.set("views", path.join(__dirname, "views"));

//Motor de plantillas (Handlebars)
app.engine(".hbs", exphbs({

    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./helpers/libs'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }

}))

app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

//Base de datos
require('./database/mongodb');

//static files
app.use(express.static(path.join(__dirname, 'public')));

//Rutas
require('./routes/index')(app);

module.exports = app;