const User = require('../models/user');
const Deuda = require('../models/deudas');
const Pago = require('../models/pagos');

const ctrl = {};

ctrl.index = async (req, res) => {

    const users = await User.find({ 'tipo': 'CLIENTE' }).select("-clave");

    res.render('clientes/index.hbs', { users });

}


ctrl.registro = (req, res) => {

    res.render('clientes/registro.hbs');

}

ctrl.guardar = async (req, res) => {

    const { cedula, nombres, apellidos, correo, telefono, direccion, observacion } = req.body;

    const errores = [];

    const exist = await User.findOne({ $or: [{ 'cedula': cedula }, { 'correo': correo }] });

    if (exist) {

        errores.push({ text: 'Cédula o Correo ya existente' })

    }

    if (errores.length == 0) {

        const newUser = new User({
            cedula,
            nombres: nombres.toUpperCase(),
            apellidos: apellidos.toUpperCase(),
            username: cedula,
            correo,
            telefono,
            direccion: direccion.toUpperCase(),
            observacion: observacion.toUpperCase(),
            clave: cedula,
            tipo: "CLIENTE"
        });

        newUser.clave = await newUser.encryptPassword(cedula);
        await newUser.save();

        res.render('clientes/registro.hbs', { success_msg: "Cliente Creado Correctamente" })

    } else {

        res.render('clientes/registro.hbs', { error_msg: errores, usuario: req.body })

    }

}

ctrl.deudas = async (req, res) => {

    const cliente = await User.findOne({ '_id': req.params.id }).select("-clave");

    const deudas = await Deuda.find({ 'usuario_id': cliente._id })
    
    total = deudas.reduce((acc,ob) => acc + (ob.valor - ob.abono),0)

    res.render('clientes/deudas.hbs', { cliente, deudas, total });

}

ctrl.add_deudas = async (req, res) => {

    const { valor, descripcion, abono, tipo } = req.body;

    const cliente = await User.findOne({ '_id': req.params.id }).select("-clave");

    const deuda = new Deuda({

        valor,
        descripcion: descripcion.toUpperCase(),
        usuario_id: cliente._id,
        estado: "PENDIENTE",
        abono

    });

    await deuda.save();

    if (abono > 0) {

        const pago = new Pago({

            valor: abono,
            descripcion: "PRIMER ABONO",
            tipo,
            deuda_id: deuda._id
        })

        await pago.save();

    }

    res.redirect('/deudas/' + cliente._id)

}


ctrl.eliminar_deuda = async (req, res) => {

    const deuda = await Deuda.findOne({ '_id': req.body.id })

    if (deuda) {

        await Pago.remove({'deuda_id':deuda._id}).exec();

        await deuda.remove();

        res.json(true);

    } else {

        res.json(false);

    }

}

module.exports = ctrl;