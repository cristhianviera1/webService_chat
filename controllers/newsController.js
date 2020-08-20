const express = require('express');
const router = express.Router();
const New = require('../models/new');
const upload = require('../public/uploadMiddleware');
const Resize = require('../public/resize');
const path = require('path');

let urlimage = null;

router.post('/images', upload.single('image'), async function (req, res) {
    const imagePath = path.join(__dirname, '../public/images');
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
        return res.status(401).json({
            error: true,
            msg: 'Por favor proporciona una imagen'
        });
    }

    const filename = await fileUpload.save(req.file.buffer);
    return res.status(200).json({
        error: false,
        data: "http://192.168.1.8:4000/images/" + filename
    });

})

router.get('/', async (req, res) => {
    const news = await New.find();
    return res.status(200).json({
        error: false,
        data: news
    });
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const news = await New.findById(id);
    return res.status(200).json({
        error: false,
        data: news
    });
});

router.post('/', upload.single('image'), async function (req, res) {
    const newBody = req.body;
    if (!newBody.title || !newBody.description || !newBody.link) {
        return res.status(400).json({error: true, msg: "No has ingresado los parámetros necesarios"})
    }
    if (!req.file) {
        this.urlimage = "";
    } else {
        const imagePath = path.join(__dirname, '../public/images/novedades');
        const fileUpload = new Resize(imagePath);
        const filename = await fileUpload.save(req.file.buffer);
        this.urlimage = "http://" + process.env.HOST + ":" + process.env.PORT + "/images/novedades/" + filename;
    }
    if (urlimage === "") {
        return res.status(500).json({
            error: true,
            msg: 'No se ha podido subir la imagen'
        })
    }
    await New.create({
        title: req.body.title,
        description: req.body.description,
        image: this.urlimage.toString(),
        link: req.body.link
    },  function(err, news) {
        if (err) {
            return res.status(500).json({
                error: true,
                msg: "No se ha podido crear la noticia, por favor intentarlo más tarde"
            });
        }
        return res.status(200).json({
            error: false,
            msg: 'Noticia creada exitosamente'
        })
    });
})

router.put('/:id', upload.single('image'), async function (req, res) {
    const {id} = req.params;
    if (!req.file) {
        this.urlimage = "";
    } else {
        const imagePath = path.join(__dirname, '../public/images/novedades');
        const fileUpload = new Resize(imagePath);
        const filename = await fileUpload.save(req.file.buffer);
        this.urlimage = "http://" + process.env.HOST + ":" + process.env.PORT + "/images/novedades/" + filename;
    }
    if (this.urlimage == "") {
        this.urlimage = req.body.image
    }

    await New.updateOne({_id: id}, {
        title: req.body.title,
        description: req.body.description,
        image: this.urlimage.toString(),
        link: req.body.link
    });
    return res.status(200).json({
        error: false,
        msg: 'New creada exitosamente'
    })
})

router.delete('/:id', async (req, res) => {
    await New.findByIdAndRemove(req.params.id);
    return res.status(200).json({
        error: false,
        msg: 'Novedad eliminada'
    });
});

module.exports = router;