const mongoose = require('mongoose');
mongoose.set('useCreateIndex' )

const trabajadorSchema = new mongoose.Schema({    

    nombre: {
        type: String
    },
    rfc: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: Number
    },
    correo: {
        type: String,
        unique: true
    },
    direccion: {
        type:String
    },
    estado: {
        type:String
    },
    factura:[{
        
        adeudo:{
            type: Number
        },
        pagado:{
            type: Number
        },
        total:{
            type: Number
        },
        fecha_factura:{
            type: Date
        },
        fecha_limite:{
            type: Date
        },   
        notas:{
            type: String
        }    
    }],
    informacion_bancaria:[{
        cuenta:{
            type: String
        },
        banco:{
            type: String
        },
        estado_b:{
            type: String
        }
    }]

})
mongoose.model('cliente', trabajadorSchema);