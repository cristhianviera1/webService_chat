const express = require('express');
const router = express.Router();
const Novedad = require('../models/novedades');

router.get('/', async (req, res) => {

    const novedad = await Novedad.find();
    res.send(novedad);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const novedad = await Novedad.findById(id);
    res.send(novedad);
});

router.post('/', async (req, res) => {
    const novedad = new Novedad(req.body);
    await novedad.save();
    res.status(200).send("Creado exitosamente");
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    await Novedad.updateOne({_id : id}, req.body);
    res.status(200).send("Actulizado con exito");
})

router.delete('/', async (req, res) => {

    Novedad.findById({ _id: req.body.id }, function (err, novedad) {
        if (novedad) {
          return res.status(400).send('La novedad no existe.');
        } else {
    
            Novedad.deleteOne({_id: req.body.id},
            function (err, novedad) {

                if (err) return res.status(500).send("Un problema ha ocurrido eliminando.");
                
                res.status(200).send(novedad);
            });
        }
      });
});

module.exports = router;