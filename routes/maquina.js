var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Maquina = require('../models/maquina');

// ========================================
// Obtener todas las maquinas
// ========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Maquina.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, maquinas) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando maquina',
                        errors: err
                    });
                }

                Maquina.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        maquinas: maquinas,
                        total: conteo
                    });
                })
            });
});

// ========================================
// Actualizar usuario
// ========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Maquina.findById(id, (err, maquina) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar maquina',
                errors: err
            });
        }

        if (!maquina) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La maquina con el id ' + id + ' no existe',
                errors: { message: 'No existe una maquina con ese ID' }
            });
        }

        maquina.usuario = req.usuario._id;
        maquina.nombre = body.nombre;
        maquina.placa_sena = body.placa_sena;
        maquina.marca = body.marca;
        maquina.ambiente = body.ambiente;
        maquina.aula = body.aula;

        maquina.save((err, maquinaGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar maquina',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                maquina: maquinaGuardada
            });
        });
    });
});

// ========================================
// Crear una nueva maquina
// ========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var maquina = new Maquina({
        nombre: body.nombre,
        placa_sena: body.placa_sena,
        marca: body.marca,
        ambiente: body.ambiente,
        aula: body.aula,
        usuario: req.usuario._id
    });

    maquina.save((err, maquinaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear maquina',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            maquina: maquinaGuardada
        });
    });
});

// ========================================
// Borrar un usuario por el id
// ========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Maquina.findByIdAndRemove(id, (err, maquinaGuardada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar la maquina',
                errors: err
            });
        }

        if (!maquinaGuardada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una maquina con ese id',
                errors: { message: 'No existe una maquina con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            maquina: maquinaGuardada
        });
    });
});

module.exports = app;