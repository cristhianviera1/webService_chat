const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var emisorMail = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'kimerinaservice@gmail.com',
    pass: 'kimerina123'
  }
});

router.get('/usuario', async (req, res) => {
  const usuarios = await Usuario.find();
  res.send(usuarios);
});

router.get('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const usuario = await Usuario.findById(id);
  res.send(usuario);
});

router.post('/usuario', async (req, res) => {
  Usuario.findOne({ correo: req.body.correo }, function (err, usuario) {
    if (usuario) {
      return res.status(404).send('Usuario ya existente.');
    } else {
      var tempPasword;
      if (req.body.password == "" || req.body.password == null) {
        var ramdomString = Math.random().toString(36).slice(-8);
        var mailOptions = {
          from: 'kimerinaservice@gmail.com',
          to: req.body.correo.toString(),
          subject: 'Bienvenido a Kimerina ' + req.body.nombre,
          text: 'Bienvenido a Kimirina, puedes ingresar a la aplicación con la siguiente contraseña, cambiala en tu primer ingreso: ' + ramdomString.toString()
        };
        emisorMail.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email enviado a: ' + req.body.correo.toString());
          }
        });
        tempPasword = bcrypt.hashSync(ramdomString, 8);
      } else {
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        tempPasword = hashedPassword;
      }
      var tempRol;
      if (req.body.rol == null || req.body.rol == "") {
        tempRol = "usuario";
      } else {
        tempRol = req.body.rol;
      }
      Usuario.create({
        nombre: req.body.nombre,
        password: tempPasword,
        correo: req.body.correo,
        edad: req.body.edad,
        genero: req.body.genero,
        online: false,
        rol: tempRol
      },
        function (err, usuario) {

          if (err) return res.status(500).send("Un problema ha ocurrido creando el usuario.");

          res.status(200).send("Usuario creado exitosamente");
        });
    }
  });
})

router.put('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  await Usuario.updateOne({ _id: id }, req.body);
  res.status(200).send("Usuario actulizado con exito");
})

router.delete('/usuario/:id', async (req, res) => {

  await Usuario.findByIdAndRemove(req.params.id);
  res.json({status: 'Empleado eliminado'});
});


router.post('/usuario/login', async (req, res) => {
  if (req.body.password == "" || req.body.password == null || req.body.correo == "" || req.body.password == null) {
    return res.status(400).send("Por favor ingrese valores");
  }
  Usuario.findOne({ correo: req.body.correo }, function (err, usuario) {
    if (usuario != null) {
      if (bcrypt.compareSync(req.body.password, usuario.password)) {
        Usuario.updateOne({ _id: usuario._id }, { online: true }, function (err, res) {
          console.log(res);
        });
        return res.status(200).send("Ha ingresado exitósamente" + usuario._id);
      } else {
        return res.status(400).send("Las credenciales no son correctas");
      }
    }
  })
});

router.post('/usuario/logout', async (req, res) => {
  if (req.body.id == "" || req.body.id == null) {
    return res.status(400).send("Por favor ingrese valores");
  }
  Usuario.findById(req.body.id, function (err, usuario) {
    if (usuario) {
      Usuario.updateOne({ _id: usuario._id }, { online: false }, function (err, res) {
        console.log(res);
      })
      res.status(200).send("Has cerrado sesión");
    }
  });
});


module.exports = router;
