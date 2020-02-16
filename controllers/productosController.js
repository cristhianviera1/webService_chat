const express = require('express');
const router = express.Router();
const Producto = require('../models/productos');
const upload = require('../public/uploadMiddleware');
const Resize = require('../public/resize');
const path = require('path');

var urlimage = null;

router.get('/', async (req, res) => {

    const producto = await Producto.find();
    res.send(producto);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const producto = await Producto.findById(id);
    res.send(producto);
});

router.post('/', upload.single('image'), async function(req, res) {

    if (!req.file) {
        this.urlimage = "";
    } else {
        console.log("Este es el buffer",req.file.buffer);
        const imagePath = path.join(__dirname, '../public/images');
        const fileUpload = new Resize(imagePath);

        const filename = await fileUpload.save(req.file.buffer);
        this.urlimage = "http://192.168.1.8:4000/images/"+filename;
    }

    if (urlimage = null) {
        return res.status(500).json({error: 'No se ha podido subir la imagen'})
    }

    Producto.create({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        imagen: this.urlimage.toString(),
        link: req.body.link,
        precio: req.body.precio,
        observaciones: req.body.observaciones
    })

    return res.status(200).json({bien: 'Producto creado exitosamente'})

    /*
    const producto = new Producto(req.body);
    await producto.save();
    res.json({status: '200', text: 'Producto creado exitosamente'});*/
})

router.put('/:id', upload.single('image'), async function(req, res)  {
    const { id } = req.params;

    if(!req.file) {
        this.urlimage = "";
    } else {
        console.log("Este es el buffer",req.file.buffer);
        const imagePath = path.join(__dirname, '../public/images');
        const fileUpload = new Resize(imagePath);

        const filename = await fileUpload.save(req.file.buffer);
        this.urlimage = "http://192.168.1.8:4000/images/"+filename;
    }

    if (urlimage = null) {
        return res.status(500).json({error: 'No se ha podido subir la imagen'})
    }

    Producto.updateOne({
        _id: id,
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        imagen: this.urlimage.toString(),
        link: req.body.link,
        precio: req.body.precio,
        obserbaciones: req.body.obserbaciones
    })

    return res.status(200).json({bien: 'Producto actualizado exitosamente'})
    /*
    await Producto.updateOne({_id : id}, req.body);
    res.json({status: '200', text: 'Producto actualizado'});*/
})

router.delete('/:id', async (req, res) => {
    await Producto.findByIdAndRemove(req.params.id);
  res.json({status: '200', text: 'Producto eliminado'});
});

module.exports = router;