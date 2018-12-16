var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Mantenimiento = require('../models/mantenimiento');
var Maquina = require('../models/maquina');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de coleccion
    var tiposValidos = ['usuarios', 'mantenimientos', 'maquinas'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { message: 'Tipo de coleccion no es valida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    //Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extensionArchivo: extensionArchivo
        // });
    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if (tipo === 'mantenimientos') {

        Mantenimiento.findById(id, (err, mantenimiento) => {

            if (!mantenimiento) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Mantenimiento no existe',
                    errors: { message: 'Mantenimiento no existe' }
                });
            }

            var pathViejo = './uploads/mantenimientos/' + mantenimiento.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            mantenimiento.img = nombreArchivo;

            mantenimiento.save((mantenimientoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de mantenimiento actualizada',
                    mantenimiento: mantenimientoActualizado
                });
            });
        });
    }

    if (tipo === 'maquinas') {

        Maquina.findById(id, (err, maquina) => {

            if (!maquina) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Maquina no existe',
                    errors: { message: 'Maquina no existe' }
                });
            }

            var pathViejo = './uploads/maquinas/' + maquina.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            maquina.img = nombreArchivo;

            maquina.save((err, maquinaActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de mantenimiento actualizada',
                    maquina: maquinaActualizado
                });
            });
        });
    }
}

module.exports = app;