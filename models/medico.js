const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicoSchema  = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es necesario'] 
    },
    img: { 
        type: String, 
        required: false 
    },
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    hospital: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hospital', 
        required: [true, 'El id hospital esun campo obligatorio'] } 
})


module.exports =  mongoose.model('Medico',medicoSchema);