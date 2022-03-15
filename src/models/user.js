const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const UsuarioSchema = new Schema({

    cedula: { type: String, required: true },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    username: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: false },
    observacion: { type: String, required: false },
    clave: { type: String, required: true },
    tipo: { type: String, required: true },
    fecha: { type: Date, default: Date.now }

});

UsuarioSchema.methods.encryptPassword = async (clave) => {

    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(clave, salt);
    return hash;

};


UsuarioSchema.methods.matchPassword = async function (clave) {

    return await bcrypt.compare(clave, this.clave);

};

module.exports = mongoose.model('User', UsuarioSchema);