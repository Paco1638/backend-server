var express = require('express');

var app = express();

var Mantenimiento = require('../models/mantenimiento');
var Maquina = require('../models/maquina');
var Usuario = require('../models/usuario');

// ============================================
// Busqueda por colección
// ============================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'mantenimientos':
            promesa = buscarMantenimientos(busqueda, regex);
            break;

        case 'maquinas':
            promesa = buscarMaquinas(busqueda, regex);
            break;

        default:
            res.status(400).json({

                ok: false,
                mensaje: 'Los tipos de busqueda solo son: usuarios, mantenimiento y maquinaria',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });
    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});

// ============================================
// Busqueda general
// ============================================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;

    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarMantenimientos(busqueda, regex),
        buscarMaquinas(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ]).then(respuestas => {

        res.status(200).json({
            ok: true,
            mantenimientos: respuestas[0],
            maquinas: respuestas[1],
            usuarios: respuestas[2]
        });
    });
});

function buscarMantenimientos(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Mantenimiento.find({ maquina: regex })
            .populate('usuario', 'nombre email role')
            .exec((err, mantenimientos) => {
                if (err) {
                    reject('Error al cargar mantenimientos', err);
                } else {
                    resolve(mantenimientos)
                }
            });
    });
}

function buscarMaquinas(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Maquina.find({ nombre: regex })
            .populate('usuario', 'nombre email role')
            .exec((err, maquinas) => {
                if (err) {
                    reject('Error al cargar maquinas', err);
                } else {
                    resolve(maquinas);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios');
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;