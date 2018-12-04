var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var maquinaSchema = new Schema({

    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    maquina: { type: Schema.Types.ObjectId, ref: 'Maquina', required: true },
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    placa_sena: { type: String, required: [true, 'La placa sena es necesaria'] },
    marca: { type: String, required: [true, 'La marca es necesaria'] },
    ambiente: { type: String, required: [true, 'El ambiente es necesario'] },
    aula: { type: String, required: [true, 'La aula es necesaria'] },
    img: { type: String, required: false }

});

module.exports = mongoose.model('Maquina', maquinaSchema);