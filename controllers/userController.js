const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Chat = require('../models/chat');
let bcrypt = require('bcryptjs');
let nodemailer = require('nodemailer');
const upload = require('../public/uploadMiddleware');
const Resize = require('../public/resize');
const path = require('path');
let ObjectId = require('mongoose').Types.ObjectId;
let urlimage = null;

let emisorMail = nodemailer.createTransport({
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

router.get('/user', async (req, res) => {
    const users = await User.find({status: true});
    return res.status(200).json({
        error: false,
        data: users
    });
});

router.get('/user/:id', async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id);
    return res.status(200).json({
        error: false,
        data: user
    });
});

router.post('/user', upload.single('image'), async function (req, res) {
    const _email = req.body.email.toLowerCase();
    User.findOne({email: _email}, async function (err, user) {
        if (user) {
            return res.status(400).json({
                error: true,
                msg: "El usuario ya existe"
            });
        }
        let tempPassword;
        if (!req.body.password) {
            let randomString = Math.random().toString(36).slice(-8);
            let mailOptions = {
                from: 'kimerinaservice@gmail.com',
                to: req.body.email.toString(),
                subject: 'Bienvenido a Kimirina ' + req.body.name,
                text: 'Bienvenido a Kimirina, puedes ingresar a la aplicación con la siguiente contraseña, cambiala en tu primer ingreso: ' + randomString.toString()
            };
            emisorMail.sendMail(mailOptions);
            tempPassword = bcrypt.hashSync(randomString, 8);
        } else {
            tempPassword = bcrypt.hashSync(req.body.password, 8);
        }
        let tempRol = req.body.rol;
        if (!tempRol) {
            tempRol = "usuario";
        }
        if (!req.file) {
            this.urlimage = "";
        } else {
            const imagePath = path.join(__dirname, '../public/images/usuarios');
            const fileUpload = new Resize(imagePath);
            const filename = await fileUpload.save(req.file.buffer);
            this.urlimage = "http://" + process.env.HOST + ":" + process.env.PORT + "/images/usuarios/" + filename;
        }

        if (urlimage === "") {
            return res.status(500).json({
                error: true,
                msg: 'No se ha podido subir la imagen'
            })
        }
        User.create({
                name: req.body.name,
                password: tempPassword,
                email: req.body.email,
                age: req.body.age,
                gender: req.body.gender,
                image: this.urlimage.toString(),
                online: false,
                rol: tempRol
            },
            function (err,user) {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        msg: "No se ha podido crear el usuario, por favor intentarlo más tarde"
                    });
                }
                return res.status(200).json({
                    error: false,
                    msg: "Usuario creado exitósamente"
                });
            });

    });
})

router.put('/user/:id', upload.single('image'), async function (req, res) {
    const {id} = req.params;
    if (!req.file) {
        this.urlimage = "";
    } else {
        const imagePath = path.join(__dirname, '../public/images/usuarios');
        const fileUpload = new Resize(imagePath);
        const filename = await fileUpload.save(req.file.buffer);
        this.urlimage = "http://" + process.env.HOST + ":" + process.env.PORT + "/images/usuarios/" + filename;
        req.body.image = this.urlimage;
    }
    if (this.urlimage == "") {
        this.urlimage = req.body.image
    }
    let user = await User.findById(id);
    if (req.body.password && req.body.password !== user.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 8);
    }
    await User.updateOne({_id: user.id}, req.body);
    return res.status(200).json({
        error: false,
        msg: 'Usuario actualizado exitosamente'
    })
})
router.put('/user/image/:id', upload.single('image'), async function (req, res) {
    const {id} = req.params;
    if (!req.file) {
        this.urlimage = "";
    } else {
        const imagePath = path.join(__dirname, '../public/images/usuarios');
        const fileUpload = new Resize(imagePath);
        const filename = await fileUpload.save(req.file.buffer);
        this.urlimage = "http://" + process.env.HOST + ":" + process.env.PORT + "/images/usuarios/" + filename;
    }
    if (this.urlimage == "") {
        this.urlimage = req.body.image
    }
    await User.updateOne({_id: id}, {
        image: this.urlimage.toString(),
    })
    return res.status(200).json({
        error: false,
        msg: this.urlimage
    });
})

router.post('/user/chats', async (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({
            error:true,
            msg:"Por favor ingrese valores"
        });
    }
    Chat.find({$or: [{"userIdSend": new ObjectId(req.body.id)}, {"userIdReceive": new ObjectId(req.body.id)}]}, function (err, chats) {
        if (err) {
            return res.status(500).json({
                error: true,
                msg: "No se ha podido recuperar los chats"
            });
        }
        return res.status(200).json({
            error: false,
            data: chats
        });
    });

});
router.post('/user/chat', async (req, res) => {
    if (!req.body.id || !req.body.idReceive) {
        return res.status(400).json({
            error: true,
            msg: "Por favor ingrese valores"
        });
    }
    Chat.find({
        $or: [
            {$and: [{"userIdSend": new ObjectId(req.body.id)}, {"userIdReceive": new ObjectId(req.body.idReceive)}]},
            {$and: [{"userIdReceive": new ObjectId(req.body.id)}, {"userIdSend": new ObjectId(req.body.idReceive)}]}]
    }, function (err, chats) {
        if (err) {
            return res.status(500).json({
                error: true,
                msg: "No se ha podido recuperar los chats"
            });
        }
        return res.status(200).json({
            error: false,
            data: chats
        });
    });

});


router.delete('/user/:id', async (req, res) => {
    await User.findByIdAndRemove(req.params.id);
    return res.status(200).json({
        error: false,
        msg: 'Usuario eliminado'
    });
});

router.post('/usuario/soft', async (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({
            error: true,
            msg: "Por favor ingrese valores"
        });
    }
    User.findById(req.body.id, function (err, user) {
        if (user) {
            User.updateOne({_id: user._id}, {status: false}, function (err, res) {
                return res.status(200).json({
                    error: false,
                    msg: "Usuario creado exitósamente"
                });
            })
        }
    });
});


router.post('/user/login', async (req, res) => {
    if (!req.body.password || !req.body.email) {
        return res.status(400).json({
            error: true,
            msg: "No ha ingresado los parámetros requeridos"
        });
    }
    User.findOne({email: req.body.email, status: true}, function (err, user) {
        if (!user) {
            return res.status(400).json({
                error: true,
                msg: "El usuario no se encuentra registrado"
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(400).json({
                error: true,
                msg: "Por favor revisa que hayas ingresado correctamente tu dirección de correo y tu contraseña"
            });
        }
        user.updateOne({_id: user._id}, {online: true}, function (err, response) {
            if (response) {
                return res.status(200).json({
                    error: false,
                    data: user
                });
            }
        });
    })
});

router.post('/user/logout', async (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({
            error: true,
            msg: "Por favor ingrese valores"
        });
    }
    User.findById(req.body.id, function (err, user) {
        if (!user) {
            return res.status(400).json({
                error: true,
                msg: "No se ha podido cerrar la sesión"
            })
        }
        User.updateOne({_id: user._id}, {online: false}, function (err, res) {
            if (res) {
                return res.status(200).json({
                    error: false,
                    msg: "Se ha cerrado sesión"
                })
            }
        })
    });
});

router.post('/user/updatePassword', async (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({
            error: true,
            msg: "Por favor ingrese valores"
        });
    }
    User.findById(req.body.id, function (err, user) {
        if (!user) {
            return res.status(400).json({
                error: true,
                msg: "No se ha encontrado el usuario"
            })
        }
        let hashedPassword = bcrypt.hashSync(req.body.password, 8);
        User.updateOne({_id: user._id}, {password: hashedPassword}, function (err, res) {
            if (err) {
                return res.status(404).json({
                    error:true,
                    msg:"Algo ha fallado"
                });
            }
        })
        return res.status(200).json({
            error:false,
            msg:"Has actualizado la contraseña"
        });
    });
});

router.post('/user/recoverPassword', async (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({
            error: true,
            msg: "Proporcione un email"
        })
    }
    await User.findOne({email: req.body.email}, function (err, user) {
        if (!user) {
            return res.status(400).json({
                error: true,
                msg: "No se ha encontrado el usuario"
            });
        }
        let randomString = Math.random().toString(36).slice(-8);
        let newHashedPassword = bcrypt.hashSync(randomString, 8);
        User.updateOne({email: user.email}, {password: newHashedPassword}, function (err, res) {
            let mailOptions = {
                from: 'kimerinaservice@gmail.com',
                to: user.email.toString(),
                subject: 'Kimirina - Nueva contraseña',
                text: 'Kimirina te informa, esta es tu nueva contraseña: ' + randomString.toString() + ' .Recuerda que puedes cambiarla a tu gusto en nuestra app.'
            };
            emisorMail.sendMail(mailOptions);
            if (err) {
                return res.status(404).json({
                    error: true,
                    msg: err
                });
            }
        })
        return res.status(200).json({
            error: false,
            msg: "Has recuperado tu contraseña"
        });
    });
});

module.exports = router;
