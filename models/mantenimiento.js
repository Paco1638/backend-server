var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var mantenimientoSchema = new Schema({

    maquina: { type: String, required: [true, 'El nombre de la maquina es requerida'] },
    pieza_danada: { type: String, required: [true, 'La pieza dañada es necesaria'] },
    pieza_reemplazada: { type: String, required: [true, 'La pieza reemplazada es necesaria'] },
    proxi_mantenimiento: { type: String, required: [true, 'La fecha del proximo mantenimiento es necesaria'] },
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }

});

module.exports = mongoose.model('Mantenimiento', mantenimientoSchema);