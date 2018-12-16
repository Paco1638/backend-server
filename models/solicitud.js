var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var solicitudSchema = new Schema({

    nombre_maquina: { type: String, required: [true, 'El nombre de la solicitud es necesario'] },
    tipo_solicitud: { type: String, required: [true, 'El tipo de solicitud es necesario'] },
    ambiente_solicitud: { type: String, required: true },
    fecha_solicitud: { type: String, required: [true, 'La fecha es necesaria'] },

});

module.exports = mongoose.model('Solicitud', solicitudSchema);