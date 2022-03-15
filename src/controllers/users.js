const User = require('../models/user');
const Deuda = require('../models/deudas');
const ctrl = {};


ctrl.index = async (req, res) => {

    const users = await User.find({ $or: [{ 'tipo': 'ADMINISTRADOR' }, { 'tipo': 'TRABAJADOR' }], $and: [{ '_id': { $nin: req.session._id } }] }).select("-clave");

    res.render('users/index.hbs', { users });

}

ctrl.registro = (req, res) => {

    res.render('users/registro.hbs');

}

ctrl.login = async (req, res) => {

    const { identificacion, clave } = req.body;

    const user = await User.findOne({ $or: [{ 'cedula': identificacion }, { 'username': identificacion }, { 'correo': identificacion }] });

    if (user) {

        if (await user.matchPassword(clave)) {

            req.session._id = user._id;
            req.session.username = user.username;
            req.session.tipo = user.tipo;

            res.redirect("/principal");

        } else {

            res.render('index.hbs', { error_msg: [{ text: "Usuario o Clave Incorrecto" }], usuario: req.body });

        }

    } else {

        res.render('index.hbs', { error_msg: [{ text: 'Usuario no encontrado' }], usuario: req.body });

    }


}

ctrl.eliminar = async (req, res) => {

    const user = await User.findOne({ '_id': req.body.id }).select("-clave");

    if (user) {

        const deudas = await Deuda.find({ 'usuario_id': user._id })
        
        if (deudas.length>0) {
            
            res.json(false);

        } else {

            await user.remove();

            res.json(true);

        }

    } else {

        res.json(false);

    }

}

ctrl.guardar = async (req, res) => {

    const { cedula, nombres, apellidos, username, correo, telefono, clave, confirm_clave } = req.body;

    const errores = [];

    if (clave != confirm_clave) {

        errores.push({ text: 'Las claves NO coinciden' })

    }

    const exist = await User.findOne({ $or: [{ 'cedula': cedula }, { 'username': username }, { 'correo': correo }] });

    if (exist) {

        errores.push({ text: 'Cédula, Usuario o Correo ya existente' })

    }

    if (errores.length == 0) {

        const newUser = new User({
            cedula,
            nombres: nombres.toUpperCase(),
            apellidos: apellidos.toUpperCase(),
            username,
            correo,
            telefono,
            clave,
            tipo: "TRABAJADOR"
        });

        newUser.clave = await newUser.encryptPassword(clave);
        await newUser.save();

        res.render('users/registro.hbs', { success_msg: "Usuario Creado Correctamente" })

    } else {

        res.render('users/registro.hbs', { error_msg: errores, usuario: req.body })

    }

}

ctrl.principal = async (req, res) => {

    const usuario = await User.findOne({ '_id': req.session._id }).select("-clave");

    res.render('principal.hbs', usuario);

};


ctrl.perfil = async (req, res) => {

    const usuario = await User.findOne({ '_id': req.params.id }).select("-clave");

    var coincide = false;
    var isclient = false;

    if (usuario._id == req.session._id) {

        coincide = true;

    }

    if (usuario.tipo == "CLIENTE") {
        isclient = true;
    }

    res.render('users/perfil.hbs', { usuario, coincide, isclient });

}


ctrl.cambiar_clave = async (req, res) => {

    const { id, clave } = req.body;

    const usuario = await User.findOne({ '_id': id });

    usuario.clave = await usuario.encryptPassword(clave);

    await usuario.save();

    var coincide = false;
    var isclient = false;

    if (usuario._id == id) {

        coincide = true;

    }

    if (usuario.tipo == "CLIENTE") {
        isclient = true;
    }

    res.render('users/perfil.hbs', { usuario, coincide, isclient });

}

ctrl.actualizar = async (req, res) => {

    const { cedula, nombres, apellidos, username, correo, telefono, direccion, observacion } = req.body;

    const usuario = await User.findOne({ '_id': req.params.id }).select("-clave");

    if (usuario) {

        const validar = await User.find({ $or: [{ 'cedula': cedula }, { 'username': username }, { 'correo': correo }] });

        if (validar.length > 1) {

            res.render('users/perfil.hbs', { error_msg: [{ text: 'Datos de usuario existentes' }], usuario });

        } else {

            usuario.cedula = cedula;
            usuario.nombres = nombres.toUpperCase();
            usuario.apellidos = apellidos.toUpperCase();
            usuario.username = username;
            usuario.correo = correo;
            usuario.telefono = telefono;
            usuario.direccion = direccion.toUpperCase();
            usuario.observacion = observacion.toUpperCase();

            await usuario.save();

            var coincide = false;
            var isclient = false;

            if (usuario._id == req.session._id) { coincide = true; }

            if (usuario.tipo == "CLIENTE") { isclient = true; }

            res.render('users/perfil.hbs', { success_msg: "Actualizado Correctamente", usuario, coincide, isclient })

        }

    } else {

        res.render('users/perfil.hbs', { error_msg: [{ text: 'Error al actualizar' }], usuario });

    }

}

ctrl.salir = async (req, res) => {

    req.session.destroy();
    res.redirect('/');
};

module.exports = ctrl;