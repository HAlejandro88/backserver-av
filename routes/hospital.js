const express = require('express'),
      mdAutenticacion = require('../middlewares/autenticacion'),
      Hospital = require('../models/hospital'),
      app = express();


      app.get('/', (req, res, next) => {

        Hospital.find()
            .exec(
                (err, hospitales) => {
    
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando hospital',
                            errors: err
                        });
                    }
    
                    res.status(200).json({
                        ok: true,
                        hospitales
                    });
    
    
    
                });
    });
    
    
    // ==========================================
    // Actualizar hospital
    // ==========================================
    app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    
        var id = req.params.id;
        var body = req.body;
    
        Hospital.findById(id, (err, hospital) => {
    
    
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                });
            }
    
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `El usuario con el id ${id} no existe`,
                    errors: { message: 'No existe un usuario con ese ID' }
                });
            }
    
    
            hospital.nombre = body.hospital;
            hospital.usuario = req.usuario._id;
           
    
            usuario.save((err, HospitalGuardado) => {
    
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar hospital',
                        errors: err
                    });
                }
    
    
                res.status(200).json({
                    ok: true,
                    usuario: HospitalGuardado
                });
    
            });
    
        });
    
    });
    
    
    
    // ==========================================
    // Crear un nuevo hospital
    // ==========================================
    app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    
        var body = req.body;
    
        var hospital = new Hospital({
            nombre: body.nombre,
            usuario: req.usuario._id
        });
    
        hospital.save((err, hospitalGuardado) => {
    
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear hospital',
                    errors: err
                });
            }
    
            res.status(201).json({
                ok: true,
                usuario: hospitalGuardado
            });
    
    
        });
    
    });
    
    
    // ============================================
    //   Borrar un hospital por el id
    // ============================================
    app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    
        let id = req.params.id;
    
        Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
    
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borrar hospital',
                    errors: err
                });
            }
    
            if (!hospitalBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un hospital con ese id',
                    errors: { message: 'No existe un hospital con ese id' }
                });
            }
    
            res.status(200).json({
                ok: true,
                hospitalBorrado
            });
    
        });
    
    });
    
    
    module.exports = app;