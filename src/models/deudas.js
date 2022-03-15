const mongoose = require('mongoose');
const { Schema } = mongoose;
const {ObjectId} = Schema;

const DeudaSchema = new Schema({

    estado: { type: String, required: true },
    valor: { type: Number, required: true },
    descripcion: { type: String, required: true },
    abono: { type: Number, default: 0 },
    fecha: { type: Date, default: Date.now },
    usuario_id: { type: ObjectId , ref: 'User'},

});


module.exports = mongoose.model('Deuda', DeudaSchema);