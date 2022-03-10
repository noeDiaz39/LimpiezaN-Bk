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
        type: String
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
        folio:{
            type:String
            
        },
        adeudo:{
            type: String
        },
        pagado:{
            type: String
        },
        total:{
            type: String
        },
        fecha_factura:{
            type: String
        },
        fecha_limite:{
            type:String
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