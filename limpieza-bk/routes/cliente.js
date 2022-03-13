const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Cliente = mongoose.model('cliente');

/* GET users listing. */
router.get('/', async(req, res, next) => {
    const cliente = await Cliente.find(function(err, cliente) {
        if (err) { next(err) }
        res.json(cliente)
    })
});

router.get('/rfc', async(req, res) => {
    const clienteencontrado = await Cliente.findOne({ rfc: req.body.rfc })
    if (clienteencontrado) {
        return res.send(clienteencontrado)
    }
    return res.send("cliente no encontrado")
})
//no funciona por el momento
router.get('/factura', async(req, res) => {
    const clienteencontrado = await Cliente.findOne({ rfc: req.body.rfc })
    if (clienteencontrado) {
        const facturaencontrada = await Cliente.findById({factura:[{_id:req.body.id}]})
    if (facturaencontrada) {
        return res.json(facturaencontrada)
    }    
    return res.send("factura no encontrado")
    }
    return res.send("cliente no encontrado")
    
    
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
    let cliente = await Cliente.findOne({ _id: req.body._id })
    if (!cliente) {
        return res.status(400).send("cliente no encontrado")
    }

    const insercion_factura = await Cliente.updateOne({ _id: req.body._id }, {     
        $push: {
            factura:{    
                folio: req.body.folio,      
                adeudo: req.body.adeudo,
                pagado: req.body.pagado,
                total: req.body.total,
                fecha_factura: req.body.fecha_factura,
                fecha_limite: req.body.fecha_limite,
                notas:req.body.notas  
              }
        } 
    });    
    res.status(201).send("registrado con exito")
})
//no funciona por el momento
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

    const actualizacion_factura = await Cliente.findByIdAndUpdate({_id:req.body.id} , {     
        $push: {
            factura:{  
                folio: req.body.folio,        
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
    }, {
        new: true
    })

    res.status(201).send(cliente_actualizado)
})

router.post('/eliminar', async(req, res) => {
    await Cliente.findOneAndDelete({ correo: req.body.correo }, function(err, clienteeliminado) {
        if (err) { res.send(err) }
        res.json({ Mensaje: 'Cliente eliminado' })
    })
})

module.exports = router;