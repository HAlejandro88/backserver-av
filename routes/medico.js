const express = require('express'),
      Medico = require('../models/medico'),
      mdAutenticacion = require('../middlewares/autenticacion'),
      app = express();
//el populate sirve para mostrar la informacion de otrat tabla
app.get('/',  (req,res) => {
    Medico.find()
          .populate('usuario','nombre email')
          .populate('hospital')
          .exec((err, medicos) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: 'erro al traer los medicos',
                err
            })
        }

        res.json({
            ok: true,
            medicos
        })
    })
})


app.post('/', mdAutenticacion.verificaToken, (req,res) => {
    let body = req.body;

    let newMedico = {
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    }

    Medico.create(newMedico,(err,medicoBD) => {
        if (err) {
            res.status(500).json({
                ok:false,
                message: 'error al crear medico',
                err
            })
        }

        res.json({
            ok: true,
            medicoBD
        })
    })
})


 // ==========================================
    // Actualizar Medico
    // ==========================================
    app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    
        let id = req.params.id;
        let body = req.body;
    
        Medico.findById(id, (err, medico) => {
    
    
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar Medico',
                    errors: err
                });
            }
    
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `El usuario con el id ${id} no existe`,
                    errors: { message: 'No existe un usuario con ese ID' }
                });
            }
    
    
            medico.nombre = body.nombre;
            medico.usuario = req.usuario._id;
            medico.hospital = body.hospital;
           
    
            medico.save((err, medicoGuardado) => {
    
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar hospital',
                        errors: err
                    });
                }
    
    
                res.status(200).json({
                    ok: true,
                    medicoGuardado
                });
    
            });
    
        });
    
    });



    // ============================================
    //   Borrar un medico por el id
    // ============================================
    app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    
        let id = req.params.id;
    
        Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
    
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error borrar medico',
                    errors: err
                });
            }
    
            if (!medicoBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un hospital con ese id',
                    errors: { message: 'No existe un hospital con ese id' }
                });
            }
    
            res.status(200).json({
                ok: true,
                medicoBorrado
            });
    
        });
    
    });
    
    
    module.exports = app;