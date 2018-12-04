var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Mantenimiento = require('../models/mantenimiento');

// ========================================
// Obtener todos los mantenimientos
// ========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Mantenimiento.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, mantenimientos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando mantenimiento',
                        errors: err
                    });
                }

                Mantenimiento.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        mantenimientos: mantenimientos,
                        total: conteo
                    });
                })
            });
});

// ========================================
// Actualizar mantenimiento
// ========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Mantenimiento.findById(id, (err, mantenimiento) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar mantenimiento',
                errors: err
            });
        }

        if (!mantenimiento) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El mantenimiento con el id ' + id + ' no existe',
                errors: { message: 'No existe un mantenimiento con ese ID' }
            });
        }

        mantenimiento.usuario = req.usuario._id;
        mantenimiento.maquina = body.maquina;
        mantenimiento.pieza_danada = body.pieza_danada;
        mantenimiento.pieza_reemplazada = body.pieza_reemplazada;
        mantenimiento.descripcion = body.descripcion;

        mantenimiento.save((err, mantenimientoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar mantenimiento',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                mantenimiento: mantenimientoGuardado
            });
        });
    });
});

// ========================================
// Crear un nuevo mantenimiento
// ========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var mantenimiento = new Mantenimiento({

        maquina: body.maquina,
        pieza_danada: body.pieza_danada,
        pieza_reemplazada: body.pieza_reemplazada,
        descripcion: body.descripcion,
        usuario: req.usuario._id

    });

    mantenimiento.save((err, mantenimientoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear mantenimiento',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            mantenimiento: mantenimientoGuardado
        });
    });
});

// ========================================
// Borrar un mantenimiento por el id
// ========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Mantenimiento.findByIdAndRemove(id, (err, mantenimientoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el mantenimiento',
                errors: err
            });
        }

        if (!mantenimientoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un mantenimiento con ese id',
                errors: { message: 'No existe un mantenimiento con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            mantenimiento: mantenimientoBorrado
        });
    });
});

module.exports = app;