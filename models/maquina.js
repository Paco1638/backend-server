var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var maquinaSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    placasena: { type: String, unique: true, required: [true, 'La placa sena es necesaria'] },
    marca: { type: String, required: [true, 'La marca es necesaria'] },
    ambiente: { type: String, required: [true, 'El ambiente es necesario'] },
    aula: { type: String, required: [true, 'La aula es necesaria'] },
    img: { type: String, required: false },

});

maquinaSchema.plugin(uniqueValidator, { message: 'La placa sena debe de ser único' });

module.exports = mongoose.model('Maquina', maquinaSchema);