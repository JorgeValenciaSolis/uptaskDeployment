//  ESTE ES EL ARCHIVO DE CONFIGURACION

// Creaando el Servidor Express

const express = require('express');

// Trayendo las Rutas
const routes  = require('./routes');

// egregando la variable para leer el file system donde esta tu proyecto
const path    = require('path');

const bodyParser   = require('body-parser');

// importar flah validator
const flash = require('connect-flash');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// importar variables de ambiente
require('dotenv').config({ path: 'variables.env'});

// importar el modelo 
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');


// importar Helpers con algunas funciones
const helpers = require('./helpers');


// Crear la conexion a la BD
const db = require('./config/db');
const { initialize } = require('./config/passport');
const { listeners } = require('process');

db.sync()
    .then(()=> console.log('Conectado a la BD'))
    .catch(error => console.log('ERROR'));

// Crear una aplicacion de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// habilitar el engine de las  vistas PUG
app.set('view engine', 'pug');

// habilitar Body Parsers para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

// agregar la carpeta de las vistas
app.set('views engine', path.join(__dirname, './views'));

// agregar flash messager
app.use(flash());

// sessiones nos permite navegar entre distintas paginas sin volvernos a autentificar.
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false,
}));

// Inicia una instancia de passport
app.use(passport.initialize());
app.use(passport.session());

// Pasar variables locales a la aplicacion 
app.use((req, res, next )=>{
    //console.log(req.user);   ver en el servidor el usuario dio login
    res.locals.vardump = helpers.vardump;  // crear la variable vardump y usarla en todos los archivos
    res.locals.mensajes= req.flash();      // usar la variable mensajes con flash en todos los archivos
    res.locals.usuario= {...req.user} || null;   // los ... crean una copia y se asigna a la variable usuario si existe
    
    next();  // para que pase a la siguiente funcion del midleware de este archivo que es Body Parsers

});



app.use('/', routes() );

// Servidor y Puerto
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('\"EL SERVIDOR ESTA FUNCIONANDO\"');
});

