var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Solicitud = require('../models/solicitud');

// ========================================
// Obtener todas las solicitud
// ========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Solicitud.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, solicitudes) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando solicitud',
                        errors: err
                    });
                }

                Solicitud.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        solicitudes: solicitudes,
                        total: conteo
                    });
                })
            });
});

// ========================================
// Obtener solicitud por ID
// ========================================

app.get('/:id', (req, res) => {
    var id = req.params.id;
    Solicitud.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, solicitud) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar solicitud',
                    errors: err
                });
            }
            if (!solicitud) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La solicitud con el id ' + id + 'no existe',
                    errors: { message: 'No existe una solicitud con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                solicitud: solicitud
            });
        })
})


// ========================================
// Actualizar solicitud
// ========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Solicitud.findById(id, (err, solicitud) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar solicitud',
                errors: err
            });
        }

        if (!solicitud) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La solicitud con el id ' + id + ' no existe',
                errors: { message: 'No existe una solicitud con ese ID' }
            });
        }

        solicitud.usuario = req.usuario._id;
        solicitud.nombre_maquina = body.nombre_maquina;
        solicitud.tipo_solicitud = body.tipo_solicitud;
        solicitud.ambiente_solicitud = body.ambiente_solicitud;
        solicitud.fecha_solicitud = body.fecha_solicitud;

        solicitud.save((err, solicitudGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar solicitud',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                solicitud: solicitudGuardada
            });
        });
    });
});

// ========================================
// Crear una nueva solicitud
// ========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var solicitud = new Solicitud({

        nombre_maquina: body.nombre_maquina,
        tipo_solicitud: body.tipo_solicitud,
        ambiente_solicitud: body.ambiente_solicitud,
        fecha_solicitud: body.fecha_solicitud,
        usuario: req.usuario._id
    });

    solicitud.save((err, solicitudGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear solicitud',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            solicitud: solicitudGuardada
        });
    });
});

// ========================================
// Borrar un solicitud por el id
// ========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Solicitud.findByIdAndRemove(id, (err, solicitudBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar la solicitud',
                errors: err
            });
        }

        if (!solicitudBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una solicitud con ese id',
                errors: { message: 'No existe una solicitud con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            solicitud: solicitudBorrada
        });
    });
});

module.exports = app;