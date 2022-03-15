const mongoose = require('mongoose');
const { Schema } = mongoose;
const {ObjectId} = Schema;

const PagoSchema = new Schema({

    valor: { type: Number, required: true },
    descripcion: { type: String, required: true },
    tipo: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    deuda_id: { type: ObjectId, ref: 'Deuda' },

});


module.exports = mongoose.model('Pago', PagoSchema);