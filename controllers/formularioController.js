const express = require('express');
const router = express.Router();
const Formulario = require('../models/formulario');

router.get('/', async (req, res) => {

    const formulario = await Formulario.find();
    res.send(formulario);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const formulario = await Formulario.findById(id);
    res.send(formulario);
});

router.post('/', async (req, res) => {
    const formulario = new Formulario(req.body);
    await formulario.save();
    res.json({status: '200', text: 'Formulario creado exitosamente'});
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    await Formulario.updateOne({_id : id}, req.body);
    res.json({status: '200', text: 'Formulario actualizado'});
})

router.delete('/:id', async (req, res) => {
    await Formulario.findByIdAndRemove(req.params.id);
  res.json({status: '200', text: 'Formulario eliminado'});
});

module.exports = router;