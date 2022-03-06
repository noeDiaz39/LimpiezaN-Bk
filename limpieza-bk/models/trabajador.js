const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
mongoose.set('useCreateIndex' )


const trabajadorSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },

    apellidoP: {
        type: String,
        required: true
    },

    apellidoM: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        require: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    pass: {
        type: String,
        required: true
    }, 
    estado: {
        type: String,
        require:true
    }   

})
trabajadorSchema.methods.generadorJWT = function() {
    return jwt.sign({
        codigo_trabajador: this.codigo_trabajador,
        correo: this.correo
    }, "pass")
}

mongoose.model('Trabajador', trabajadorSchema);