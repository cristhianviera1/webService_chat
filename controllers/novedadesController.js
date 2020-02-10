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
    res.json({status: '200', text: 'Novedad creada exitosamente'});
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    await Novedad.updateOne({_id : id}, req.body);
    res.json({status: '200', text: 'Novedad actualizada'});
})

router.delete('/:id', async (req, res) => {
    await Novedad.findByIdAndRemove(req.params.id);
  res.json({status: '200', text: 'Novedad eliminada'});
});

module.exports = router;