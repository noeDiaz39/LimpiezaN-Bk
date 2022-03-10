const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

const mongoose = require('mongoose');
const { JsonWebTokenError } = require('jsonwebtoken');
const Trabajador = mongoose.model('Trabajador');

/* GET users listing. */
router.get('/', async(req, res, next) => {
    const trabajador = await Trabajador.find(function(err, trabajador) {
        if (err) { next(err) }
        res.json(trabajador)
    })
});

router.post('/', [
    check('correo').isLength({ min: 3 }),
    check('pass').isLength({ min: 3 })
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let trabajador = await Trabajador.findOne({ correo: req.body.correo })
    if (trabajador) {
        return res.status(400).send('ya esta registrado')
    }

    const salt = await await bcrypt.genSalt(10)

    const passcifrado = await bcrypt.hash(req.body.pass, salt)

    trabajador = new Trabajador({

        nombre: req.body.nombre,
      apellidoP: req.body.apellidoP,
      apellidoM: req.body.apellidoM,
      telefono: req.body.telefono,
      correo: req.body.correo,
      pass: passcifrado,
      estado: req.body.estado
    });
    await trabajador.save()
    const jwtoken = trabajador.generadorJWT();
    const envio = [jwtoken + ",", trabajador.nombre + ",", trabajador.estado]
    res.status(201).send({envio})    
})

router.put('/', async(req, res) => {
    let trabajador = await Trabajador.findOne({ correo: req.body.correo })
    if (!trabajador) {
        return res.status(400).send("Usuario no encontrado")
    }

    const trabajador_modificado = await Trabajador.findOneAndUpdate({ correo: req.body.correo }, {
        nombre: req.body.nombre,
      apellidoP: req.body.apellidoP,
      apellidoM: req.body.apellidoM,
      telefono: req.body.telefono,
      estado: req.body.estado

    }, {
        new: true
    })

    res.status(201).send(trabajador_modificado)
})
router.get('/:correo', async(req, res) => {
    const trabajadorencontrado = await Trabajador.findOne({ correo: req.params.correo })
    if (trabajadorencontrado) {
        return res.send(trabajadorencontrado)
    }
    return res.send("Trabajador no encontrado")
})

router.post('/eliminar', async(req, res) => {
    await Trabajador.findOneAndDelete({ correo: req.body.correo }, function(err, trabajadorelimnado) {
        if (err) { res.send(err) }
        res.json({ Mensaje: 'Trabajador eliminado' })
    })
})


router.post('/login', [
    check('correo'),
    check('pass'),
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let trabajador = await Trabajador.findOne({ correo: req.body.correo })

    if (!trabajador) {
        return res.status(400).send('codigo de trabajador o contraseña incorrecto')
    }
    const validacontra = await bcrypt.compare(req.body.pass, trabajador.pass)

    if (!validacontra) {
        return res.status(400).send('codigo de trabajador o contraseña incorrecto')
    }

    const jwtoken = trabajador.generadorJWT();
    const envio = [jwtoken + ",", trabajador.nombre + ",", trabajador.estado]
    res.status(201).send({ envio })
})

module.exports = router;