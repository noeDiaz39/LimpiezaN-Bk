const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');


const mongoose = require('mongoose');
const { JsonWebTokenError } = require('jsonwebtoken');
const empleados = mongoose.model('empleados');

/* GET users listing. */
router.get('/', async(req, res, next) => {
    const empleado = await empleados.find(function(err, empleado) {
        if (err) { next(err) }
        res.json(empleado)
    })
});

router.post('/agregar',  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let empleado = await empleados.findOne({ correo: req.body.correo })
    if (empleado) {
        return res.status(400).send('ya esta registrado')
    }

    const salt = await await bcrypt.genSalt(10)

    const passcifrado = await bcrypt.hash(req.body.pass, salt)

    empleado = new empleados({
      nombre: req.body.nombre,
      apellidoP: req.body.apellidoP,
      apellidoM: req.body.apellidoM,
      telefono: req.body.telefono,
      correo: req.body.correo,
      pass: passcifrado,
      estado: req.body.estado,
    });
    await empleado.save()
    //const token = JsonWebTokenError.sing({ _id: empleado._id }, 'secretKey')
    //res.status(200).send(token)
})

router.post('/modificar', async(req, res) => {

    let empleado = await empleados.findOne({ correo: req.body.correo })
    if (!empleado) {
        return res.status(400).send("Usuario no encontrado")
    }

    const salt = await bcrypt.genSalt(10)
    const passcifrado = await bcrypt.hash(req.body.pass, salt)

    modificar_empleado = await empleados.findOneAndUpdate({ correo: req.body.correo }, {
      nombre: req.body.nombre,
      apellidoP: req.body.apellidoP,
      apellidoM: req.body.apellidoM,
      telefono: req.body.telefono,
      correo: req.body.correo,
      pass: passcifrado,
      estado: req.body.estado
    }, {
        new: true
    })

    res.send(modificar_empleado)
})


router.post('/login', [
    check('correo'),
    check('pass'),
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let empleado = await empleados.findOne({ correo: req.body.correo })

    if (!empleado) {
        return res.status(400).send('correo o contraseña incorrecto')
    }
    const validacontra = await bcrypt.compare(req.body.pass, empleado.pass)

    if (!validacontra) {
        return res.status(400).send('correo o contraseña incorrecto')
    }
    const jwtoken = empleado.generadorJWT();
    const envio = [jwtoken + ",", empleado.nombre + ",", empleado.estado]
    res.status(201).send({ envio })
})






router.put('/:codigo', auth, async(req, res) => {
    let empleado = await empleados.findOne({ id_empleado: req.params._id })
    if (!empleado) {
        return res.status(400).send("Empleado no encontrado")
    }
    const salt = await bcrypt.genSalt(10)
    const passcifrado = await bcrypt.hash(req.body.pass, salt),

    modificar_empleado = await empleados.findByIdAndUpdate({
      id_empleado: req.body.id_empleado
        }, {
          nombre: req.body.nombre,
          apellidoP: req.body.apellidoP,
          apellidoM: req.body.apellidoM,
          telefono: req.body.telefono,
          correo: req.body.correo,
          pass: passcifrado,
          estado: req.body.estado
        }, {
            new: true
        })
    res.send(modificar_empleado)
})
module.exports = router;