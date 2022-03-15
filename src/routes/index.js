
const clientes = require('../controllers/clientes');
const pagar = require('../controllers/pagar');
const reportes = require('../controllers/reportes');
const usuarios = require('../controllers/users');

const { isAuthenticated, notAuthenticated } = require('../helpers/auth');

//Rutas del servidor
module.exports = (app) => {

    app.get('/', notAuthenticated, (req, res) => { res.render('index.hbs'); });
    app.post('/', usuarios.login);

    // Clientes
    app.get('/clientes', isAuthenticated, clientes.index);
    app.delete('/clientes', usuarios.eliminar);
    app.get('/clientes/add', clientes.registro);
    app.post('/clientes/add', clientes.guardar);

    // Deudas
    app.delete('/deudas', clientes.eliminar_deuda);
    app.get('/deudas/:id',clientes.deudas);
    app.post('/deudas/:id',clientes.add_deudas);

    app.get('/pagar', isAuthenticated, pagar.index);
    app.get('/reportes', isAuthenticated, reportes.index);

    // Usuarios
    app.get('/usuarios', isAuthenticated, usuarios.index);
    app.delete('/usuarios/', usuarios.eliminar);
    app.get('/usuarios/add', usuarios.registro);
    app.post('/usuarios/add', usuarios.guardar);

    app.get('/perfil/:id', isAuthenticated, usuarios.perfil);
    app.post('/perfil/:id', isAuthenticated, usuarios.actualizar);
    
    app.post('/updateclave', usuarios.cambiar_clave);

    app.get('/salir', isAuthenticated, usuarios.salir);
    app.get('/principal', isAuthenticated, usuarios.principal);

    // Errores
    app.use(function (err, req, res, next) {

        if (err.status == undefined) {

            res.status(500).render('errores/500');

        } else {

            res.status(err.status).render('errores/' + err.status);

        }

    });

    app.use(function (req, res, next) {

        res.status(404).render('errores/404');

    });

}