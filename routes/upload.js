const express =  require('express'),
      Usuario = require('../models/usuario'),
      Medico = require('../models/medico'),
      Hospital = require('../models/hospital'),
      fileUpload = require('express-fileupload'),
      fs = require('fs'),
      app = express();


//pongo el middleware
app.use(fileUpload());





app.put('/:tipo/:id', (req,res, next) => {

    let id = req.params.id;
    let tipo = req.params.tipo;

    //tipos de coleccione
    let tiposValidos = ['hospitales','medicos','usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Tipo de coleccion no es válida',
            errors: {message: 'Tipo de coleccion no es válida'}
        })
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no selecciono nada',
            errors: {message: 'Debe de seleccionar una imagen'}
        })
    }

    //Obtener el nombre del archivo

    let archivo = req.files.imagen;
    let nombreCorto = archivo.name.split('.');
    let extencionArchivo = nombreCorto[nombreCorto.length -1];

    //extenciones validas

    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionesValidas.indexOf(extencionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'no es una extencion valida',
            errors: {message: `las extenciones validas son ${extencionesValidas.join(', ')}`}
        })
    }

    //Renombro la imagen
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencionArchivo}`;

    // el directorio al cual se moveran los archivos o imagenes
    let path = `./upload/${tipo}/${nombreArchivo}`;

    //Muevo el directorio a u acarpeta espècifica
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al mover archivo',
                err
            })
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        /*  */
    })
})

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if(!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe',
                    errors: {message: 'Medico no existe'}
                })
            }

            let pathViejo = `./upload/medicos/${medico.img}`;
            if (err) {
                res.status(400).json({
                    ok: false,
                    message: 'error al eliminar archivo',
                    err
                })
            }

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, error => {
                    if (err) throw err
                    console.log('file no borrado');
                })
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado )=> {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        message: ' error al actualizar la imagen de medico',
                        err
                    })
                }

                medicoActualizado.password = ':)';
                return res.json({
                    ok: true,
                    mensaje: 'Imagen de Medico Actualizado',
                    medicoActualizado
                })
            })
        })
        
    }
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if(!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: {message: 'Usuario no existe'}
                })
            }

            let pathViejo = './upload/usuarios/' + usuario.img;
                
            if (err) {
                res.status(400).json({
                    ok: false,
                    message:'error al eliminar arcvhivo',
                    err
                })
            }

            //si exixte elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => {
                    if (err) throw err
                    console.log('file borrado')
                });
            }

            usuario.img = nombreArchivo; 

            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        message: ' error al actualizar la imagen de usuario',
                        err
                    })
                }
                usuarioActualizado.password = ':)';
                return res.json({
                    ok: true,
                    mensaje: 'Imagen de Usuario Actualizado',
                    usuarioActualizado
                })
            })
        })
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if(!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    errors: {message: 'Hospital no existe'}
                })
            }

            let pathViejo = './upload/hospitales/' + hospital.img;
                
            if (err) {
                res.status(400).json({
                    ok: false,
                    message:'error al eliminar archivo',
                    err
                })
            }

            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, err => {
                    if (err) throw err
                    console.log('file borrado')
                });
            }

            hospital.save((err, hospitalActualizado) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        message: ' error al actualizar la imagen de hospital',
                        err
                    })
                }
                hospitalActualizado.password = ':)';
                return res.json({
                    ok: true,
                    mensaje: 'Imagen de Usuario Actualizado',
                    hospitalActualizado
                })
            })
        })
    }
}

module.exports = app;