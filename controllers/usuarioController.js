const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');

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

      var hashedPassword = bcrypt.hashSync(req.body.contraseña, 8);
      Usuario.create({
        contraseña: hashedPassword,
        correo: req.body.correo,
        edad: req.body.edad,
        genero: req.body.genero,
        rol: req.body.rol
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

router.delete('/usuario', async (req, res) => {

  Usuario.findById({ _id: req.body.id }, function (err, usuario) {
    if (usuario) {
      return res.status(400).send('El usuario no existe.');
    } else {

      Usuario.deleteOne({ _id: req.body.id },
        function (err, usuario) {

          if (err) return res.status(500).send("Un problema ha ocurrido eliminando el usuario.");

          res.status(200).send(usuario);
        });
    }
  });
});


router.post('/login', async (req, res) => {
  Usuario.findOne({ correo: req.body.correo }, function (err, usuario) {
    if (usuario != null) {
      if (bcrypt.compareSync(req.body.password, usuario.contraseña)) {
        Usuario.update()
      }
    }
  })
});
module.exports = router;