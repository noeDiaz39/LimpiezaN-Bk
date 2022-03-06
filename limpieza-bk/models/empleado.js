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
        nombre: this.nombre,
        correo: this.correo
    }, "contraseña")
}

mongoose.model('empleados', trabajadorSchema);