const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const { json } = require('express');
const Cliente = mongoose.model('cliente');

/* GET users listing. */
router.get('/', async(req, res, next) => {
    const cliente = await Cliente.find()
    res.send(cliente).status(200)
});
router.post('/envio', [ 
    check('rfc').isLength({ min: 1 })
], async(req, res) => {
    const infocli = await Cliente.findOne({ rfc: req.body.rfc })
    if (infocli) { 
            let testAccount = await nodemailer.createTestAccount();
            const transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 465,
              secure: true, // true for 465, false for other ports
              auth: {
                user: '2119200696@soy.utj.edu.mx', // generated ethereal user
                pass: 'pkjvbvljtsjpoxjr', // generated ethereal password
              },
            });    
        // send mail with defined transport object
        const infoimail = {
            from: '"Estado de tu cuenta" <2119200696@soy.utj.edu.mx>', // sender address
            to: infocli.correo, // list of receivers
            subject: "Limpieza nava", // Subject line
            text: (JSON.stringify(infocli.factura)) // plain text body
        }
    transporter.sendMail(infoimail,(error,info) =>{
        if(error){
           return res.status(400).send(error.message)
        }else{            
            return res.status(200).send("mensaje enviado")
        }
    });
    }else{
        return res.send("cliente no encontrado")
    }    
})

router.get('/rfc', async(req, res) => {
    const clienteencontrado = await Cliente.findOne({ rfc: req.body.rfc })
    if (clienteencontrado) {
        return res.send(clienteencontrado)        
    }
    return res.send("cliente no encontrado")
})
//no funciona por el momento
router.get('/factura', async(req, res) => {
    const clienteencontrado = await Cliente.findOne({rfc:req.body.rfc})
    if (clienteencontrado) {        
        return res.status(200).send(JSON.stringify(clienteencontrado.factura))
    }
    return res.status(400).send("factura no encontrado")   
    
})


router.post('/', [ 
    check('correo').isLength({ min: 1 }),   
    check('rfc').isLength({ min: 1 })
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let cliente = await Cliente.findOne({ correo: req.body.correo ,rfc: req.body.rfc})
    if (cliente) {
        return res.status(400).send('ya esta registrado el correo o RFC')
    }

    cliente = new Cliente({
      nombre: req.body.nombre,
      rfc: req.body.rfc,
      telefono: req.body.telefono,
      correo: req.body.correo,
      direccion: req.body.direccion,
      estado: req.body.estado 
    });
    await cliente.save()
    res.status(201).send("registrado con exito")
})

router.post('/factura', [       
    
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let cliente = await Cliente.findOne({ rfc: req.body.rfc })
    if (!cliente) {
        return res.status(400).send("cliente no encontrado")
    }

    const insercion_factura = await Cliente.updateOne({ rfc: req.body.rfc }, {     
        $push: {
            factura:{         
                adeudo: req.body.adeudo,
                pagado: req.body.pagado,
                total: adeudo-pagado,
                fecha_factura: req.body.fecha_factura,
                fecha_limite: req.body.fecha_limite,
                notas:req.body.notas  
              }
        } 
    });    
    res.status(201).send("registrado con exito")
})
//no funciona por el momento actusalizar
router.put('/factura', [       
    check('rfc').isLength({ min: 1 })
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let cliente = await Cliente.findOne({ rfc: req.body.rfc })
    if (!cliente) {
        return res.status(400).send("cliente no encontrado")
    } 
    JSON.stringify(Cliente)
    const actualizacion_factura = await Cliente.findByIdAndUpdate({factura:{_id:req.body._id} } , { 
        
        $push: {
            factura:{         
                adeudo: req.body.adeudo,
                pagado: req.body.pagado,
                total: req.body.total 
              }
        } 
    });    
    res.status(201).send("registrado con exito"+ actualizacion_factura)
})

router.post('/banco', [       
    check('rfc').isLength({ min: 1 })
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let cliente = await Cliente.findOne({ rfc: req.body.rfc })
    if (!cliente) {
        return res.status(400).send("cliente no encontrado")
    }

    const insercion_banco = await Cliente.updateOne({ rfc: req.body.rfc }, {     
        $push: {
            informacion_bancaria:{
                cuenta: req.body.cuenta,
                banco: req.body.banco,        
                estado_b: req.body.estado_b 
                }
        } 
    });    
    res.status(201).send("registrado con exito")
})


router.put('/', async(req, res) => {
    let cliente = await Cliente.findOne({ rfc: req.body.rfc })
    if (!cliente) {
        return res.status(400).send("cliente no encontrado")
    }
    

    const cliente_actualizado = await Cliente.findOneAndUpdate({ rfc: req.body.rfc }, {
        nombre: req.body.nombre,        
        telefono: req.body.telefono,        
        direccion: req.body.direccion,
        estado: req.body.estado
    })

    res.status(201).send("actualizacion completada")
})

router.post('/eliminar', async(req, res) => {
    await Cliente.findOneAndDelete({ correo: req.body.correo }, function(err, clienteeliminado) {
        if (err) { res.send(err) }
        res.json({ Mensaje: 'Cliente eliminado' })
    })
})

module.exports = router;