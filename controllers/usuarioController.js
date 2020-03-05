const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const Chat = require('../models/chat');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
const upload = require('../public/uploadMiddleware');
const Resize = require('../public/resize');
const path = require('path');
var ObjectId = require('mongoose').Types.ObjectId;


var urlimage = null;



var emisorMail = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'kimerinaservice@gmail.com',
    pass: 'kimerina123'
  },
  tls: {
    rejectUnauthorized: false
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

router.post('/usuario', upload.single('image'), async function (req, res) {
  Usuario.findOne({ correo: req.body.correo }, async function (err, usuario) {
    if (usuario) {
      return res.status(404).send({ "error": true, "msg": "El usuario ya existe" });
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

      //Imagen------------------------------------------------------------------
      if (!req.file) {
        this.urlimage = "";
      } else {
        console.log("Este es el buffer", req.file.buffer);
        const imagePath = path.join(__dirname, '../public/images/usuarios');
        const fileUpload = new Resize(imagePath);

        const filename = await fileUpload.save(req.file.buffer);
        this.urlimage = "http://" + process.env.HOST + ":" + process.env.PORT + "/images/usuarios/" + filename;
      }

      if (urlimage = null) {
        return res.status(500).json({ error: 'No se ha podido subir la imagen' })
      }
      //Fin imagen ---------------------------------------------------------------------


      Usuario.create({
        nombre: req.body.nombre,
        password: tempPasword,
        correo: req.body.correo,
        edad: req.body.edad,
        genero: req.body.genero,
        imagen: this.urlimage.toString(),
        online: false,
        rol: tempRol
      },
        function (err, usuario) {
          if (err) {
            return res.status(500).send({ "error": true, "msg": "No se ha podido crear el usuario, por favor intentarlo más tarde" });
          }
          return res.status(200).send({ "error": false, "msg": "Usuario creado exitósamente" });
        });
    }
  });
})

router.put('/usuario/:id', upload.single('image'), async function (req, res) {
  const { id } = req.params;

  if (!req.file) {
    this.urlimage = "";
  } else {
    console.log("Este es el buffer", req.file.buffer);
    const imagePath = path.join(__dirname, '../public/images/usuarios');
    const fileUpload = new Resize(imagePath);

    const filename = await fileUpload.save(req.file.buffer);
    this.urlimage = "http://" + process.env.HOST + ":" + process.env.PORT + "/images/usuarios/" + filename;
  }

  if (urlimage = null) {
    return res.status(500).json({ error: 'No se ha podido subir la imagen' })
  }

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  await Usuario.updateOne({ _id: id }, {
    nombre: req.body.nombre,
    password: hashedPassword,
    correo: req.body.correo,
    edad: req.body.edad,
    genero: req.body.genero,
    imagen: this.urlimage.toString(),
    rol: req.body.rol
  })

  return res.status(200).json({ bien: 'Usuario actualizado exitosamente' })
})
router.put('/usuario/imagen/:id', upload.single('image'), async function (req, res) {
  const { id } = req.params;

  if (!req.file) {
    this.urlimage = "";
  } else {
    console.log("Este es el buffer", req.file.buffer);
    const imagePath = path.join(__dirname, '../public/images/usuarios');
    const fileUpload = new Resize(imagePath);

    const filename = await fileUpload.save(req.file.buffer);
    this.urlimage = "http://" + process.env.HOST + ":" + process.env.PORT + "/images/usuarios/" + filename;
  }

  if (urlimage = null) {
    return res.status(500).json({ error: 'No se ha podido subir la imagen' })
  }


  await Usuario.updateOne({ _id: id }, {
    imagen: this.urlimage.toString(),
  })

  return res.status(200).json({ bien: 'Usuario actualizado exitosamente' })
})
//getChats
router.post('/usuario/chats', async (req, res) => {
  if (req.body.id === "" || req.body.id === null || req.body.id === undefined) {
    return res.status(400).send("Por favor ingrese valores");
  }
  Chat.find({ $or: [{ "userIdSend": new ObjectId(req.body.id) }, { "userIdReceive": new ObjectId(req.body.id) }] }, function (err, chats) {
    if (err) {
      return res.status(500).send("No se ha podido recuperar los chats");
    }
    return res.status(200).send(chats);
  });

});
router.post('/usuario/chat', async (req, res) => {
  if (req.body.id === "" || req.body.id === null || req.body.id === undefined || req.body.idReceive === "" || req.body.idReceive === null || req.body.idReceive === undefined) {
    return res.status(400).send("Por favor ingrese valores");
  }
  Chat.find({
    $or: [
      { $and: [{ "userIdSend": new ObjectId(req.body.id) }, { "userIdReceive": new ObjectId(req.body.idReceive) }] },
      { $and: [{ "userIdReceive": new ObjectId(req.body.id) }, { "userIdSend": new ObjectId(req.body.idReceive) }] }]
  }, function (err, chats) {
    if (err) {
      return res.status(500).send("No se ha podido recuperar los chats");
    }
    return res.status(200).send(chats);
  });

});


router.delete('/usuario/:id', async (req, res) => {

  await Usuario.findByIdAndRemove(req.params.id);
  res.json({ status: '200', text: 'Usuario eliminado' });
});


router.post('/usuario/login', async (req, res) => {
  if (req.body.password == "" || req.body.password == null || req.body.correo == "" || req.body.password == null) {
    return res.status(400).send({ "error": true, "msg": "No ha ingresado los parámetros requeridos" });
  }
  Usuario.findOne({ correo: req.body.correo }, function (err, usuario) {
    if (usuario != null) {
      if (bcrypt.compareSync(req.body.password, usuario.password)) {
        Usuario.updateOne({ _id: usuario._id }, { online: true }, function (err, res) {
        });
        return res.status(200).send({ "error": false, "msg": "Ha iniciado sesión exitósamente", "usuario": { "id": usuario._id, "nombre": usuario.nombre, "correo": usuario.correo, "imagen": usuario.imagen, "edad": usuario.edad, "genero": usuario.genero, "rol": usuario.rol } });
      } else {
        return res.status(400).send({ "error": true, "msg": "Por favor revisa que hayas ingresado correctamente tu dirección de correo y tu contraseña" });
      }
    } else {
      return res.status(400).send({ "error": true, "msg": "El usuario no se encuentra registrado" });
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
      res.json({ status: '200', text: 'Se ha cerrado la session' });
    }
  });
});

router.post('/usuario/updPassword', async (req, res) => {
  if (req.body.id == "" || req.body.id == null) {
    return res.status(400).send("Por favor ingrese valores");
  }
  Usuario.findById(req.body.id, function (err, usuario) {
    if (usuario) {
      var hashedPassword = bcrypt.hashSync(req.body.password, 8);
      Usuario.updateOne({ _id: usuario._id }, { password: hashedPassword }, function (err, res) {
        console.log(res);
        if (err) {
          res.status(404).send("Algo ha fallado");
        }
      })
      res.status(200).send("Has actualizado la contraseña");
    }
  });
});

router.post('/usuario/recuperarPassword', async (req, res) => {
  if (req.body.correo == "" || req.body.correo == null) {
    return res.status(400).send("Proporcione un email")
  }

  await Usuario.findOne({ correo: req.body.correo }, function (err, usuario) {
    if (usuario) {
      var ramdomString = Math.random().toString(36).slice(-8);
      var newHashedPassword = bcrypt.hashSync(ramdomString, 8);
      Usuario.updateOne({ correo: usuario.correo }, { password: newHashedPassword }, function (err, res) {
        console.log(res);

        var mailOptions = {
          from: 'kimerinaservice@gmail.com',
          to: usuario.correo.toString(),
          subject: 'Kimerina - Nueva contraseña',
          text: 'Kimerina te informa, esta es tu nueva contraseña: ' + ramdomString.toString() + ' .Recuerda que puedes cambiarla a tu gusto en nuestra app.'
        };
        emisorMail.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email enviado a: ' + usuario.correo.toString());
          }
        });

        if (err) {
          res.status(404).send("Algo ha fallado");
        }
      })
      res.status(200).send("Has recuperado tu contraseña");
    }
  });
});

module.exports = router;
