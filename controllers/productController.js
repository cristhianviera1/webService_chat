const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const upload = require('../public/uploadMiddleware');
const Resize = require('../public/resize');
const path = require('path');

let urlimage = null;

router.get('/', async (req, res) => {
    const products = await Product.find();
    return res.status(200).json({
        error: false,
        data: products
    });
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    return res.status(200).json({
        error: false,
        data: product
    });
});

router.post('/', upload.single('image'), async function (req, res) {
    if (!req.file) {
        this.urlimage = "";
    } else {
        const imagePath = path.join(__dirname, '../public/images/productos');
        const fileUpload = new Resize(imagePath);
        const filename = await fileUpload.save(req.file.buffer);
        this.urlimage = "http://" + process.env.HOST + ":" + process.env.PORT + "/images/productos/" + filename;
    }
    if (urlimage == "") {
        return res.status(500).json({
            error: true,
            msg: 'No se ha podido subir la imagen'
        })
    }

    await Product.create({
        title: req.body.title,
        description: req.body.description,
        image: this.urlimage.toString(),
        link: req.body.link,
        price: req.body.price,
        observations: req.body.observations
    })

    return res.status(200).json({
        error: false,
        msg: 'Producto creado exitosamente'
    })
})

router.put('/:id', upload.single('image'), async function (req, res) {
    const {id} = req.params;
    if (!req.file) {
        this.urlimage = "";
    } else {
        const imagePath = path.join(__dirname, '../public/images/productos');
        const fileUpload = new Resize(imagePath);

        const filename = await fileUpload.save(req.file.buffer);
        this.urlimage = "http://" + process.env.HOST + ":" + process.env.PORT + "/images/productos/" + filename;
    }

    if (this.urlimage == "") {
        this.urlimage = req.body.image
    }

    await Product.updateOne({_id: id}, {
        title: req.body.title,
        description: req.body.description,
        image: this.urlimage.toString(),
        link: req.body.link,
        price: req.body.price,
        observations: req.body.observations
    })

    return res.status(200).json({
        error: true,
        msg: 'Producto actualizado exitosamente'
    })
})

router.delete('/:id', async (req, res) => {
    await Product.findByIdAndRemove(req.params.id);
    return res.status(200).json({
        error: true,
        msg: 'Product eliminado'
    });
});

module.exports = router;