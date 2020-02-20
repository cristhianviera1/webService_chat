const express = require('express');
const router = express.Router();
const Novedad = require('../models/novedades');
const upload = require('../public/uploadMiddleware');
const Resize = require('../public/resize');
const path = require('path');

var urlimage = null;

//Subir imagenes
router.post('/images', upload.single('image'), async function(req, res) {
    console.log("Este es el buffer",req.file.buffer);
    const imagePath = path.join(__dirname, '../public/images/chat');
    const fileUpload = new Resize(imagePath);

    if(!req.file) {
        res.status(401).json({error: 'Por favor proporciona una imagen'});
    }

    const filename = await fileUpload.save(req.file.buffer);
    return res.status(200).json({url: "http://192.168.1.8:4000/images/chat"+filename});
    
})

//-------------------------------------

router.get('/', async (req, res) => {

    const novedad = await Novedad.find();
    res.send(novedad);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const novedad = await Novedad.findById(id);
    res.send(novedad);
});

router.post('/', upload.single('image'), async function(req, res) {
    if (!req.file) {
        this.urlimage = "";
    } else {
        console.log("Este es el buffer",req.file.buffer);
        const imagePath = path.join(__dirname, '../public/images/novedades');
        const fileUpload = new Resize(imagePath);

        const filename = await fileUpload.save(req.file.buffer);
        this.urlimage = "http://"+process.env.HOST+":"+process.env.PORT+"/images/novedades/"+filename;
    }

    if (urlimage = null) {
        return res.status(500).json({error: 'No se ha podido subir la imagen'})
    }

    await Novedad.create({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        imagen: this.urlimage.toString(),
        link: req.body.link
    })

    return res.status(200).json({bien: 'Novedad creada exitosamente'})
    /*
    const novedad = new Novedad(req.body);
    await novedad.save();
    res.json({status: '200', text: 'Novedad creada exitosamente'});*/
})

router.put('/:id', upload.single('image'), async function(req, res) {
    const { id } = req.params;

    if (!req.file) {
        this.urlimage = "";
    } else {
        console.log("Este es el buffer",req.file.buffer);
        const imagePath = path.join(__dirname, '../public/images/novedades');
        const fileUpload = new Resize(imagePath);

        const filename = await fileUpload.save(req.file.buffer);
        this.urlimage = "http://"+process.env.HOST+":"+process.env.PORT+"/images/novedades/"+filename;
    }

    if (urlimage = null) {
        return res.status(500).json({error: 'No se ha podido subir la imagen'})
    }

    await Novedad.updateOne({_id: id},{
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        imagen: this.urlimage.toString(),
        link: req.body.link
    })

    return res.status(200).json({bien: 'Novedad creada exitosamente'})

})

router.delete('/:id', async (req, res) => {
    await Novedad.findByIdAndRemove(req.params.id);
  res.json({status: '200', text: 'Novedad eliminada'});
});

module.exports = router;