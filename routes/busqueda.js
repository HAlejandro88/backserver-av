const express = require('express'),
      Hospital = require('../models/hospital'),
      Medico = require('../models/medico'),
      Usuarios = require('../models/usuario'),
      app = express();


app.get('/todo/:busqueda', (req,res) => {
    
    let busqueda  =  req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(busqueda, regex), 
                buscarMedicos(busqueda,regex),
                buscarUsuarios(busqueda,regex)]).then(respuestas => {

                    res.json({
                        ok: true,
                        hospitales: respuestas[0],
                        medicos: respuestas[1],
                        usuarios: respuestas[2]
                    })
                })

    
})

app.get('/coleccion/:tabla/:busqueda', (req,res) => {

    let busqueda =  req.params.busqueda;
    let tabla = req.params.tabla;
    let regex =  new RegExp(busqueda, 'i');

    let promesa;

    switch(tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
        break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
        break;

        case 'hospitales': 
            promesa =  buscarHospitales(busqueda, regex);
        break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son usuarios, mediocs y hospitales',
                errors: {message: 'tipo de tabla /coleccion no válido'}
            });
    }  
    
    
    promesa.then( data => {
        res.json({
            ok: true,
            [tabla]: data //propiedades de objeto computada o procesadas
        })
    })

    
})



function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({nombre: regex})
                .populate('usuario', 'nombre email') 
                .exec((err, hospitales) => {
                    if(err) {
                        reject('error al cargar hospitales', err)
                    }else{
                        resolve(hospitales)
                    }
                })
    });
    
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({nombre: regex}, (err, medicos) => {
            if(err) {
                reject('error al cargar medicos', err)
            }else {
                resolve(medicos)
            }
        })
    })
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuarios.find({}, 'nombre email role')
                .or([{'nombre': regex}, {'email': regex}])
                .exec((err, usuarios) => {
                    if(err) {
                        reject('error al cargar usuarios')
                    } else {
                        resolve(usuarios)
                    }
                })
    })
}


module.exports = app;