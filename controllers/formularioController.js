const express = require('express');
const router = express.Router();
const Formulario = require('../models/formulario');

router.get('/', async (req, res) => {

    const formulario = await Formulario.find().populate({ path: 'personaLlena', select: 'nombre' });
    var response = [];
    for (var form in formulario) {
        var newForm = {
           "fechaLlena": formulario[form].fechaLlena,
            "pregunta1": formulario[form].pregunta1,
            "pregunta2": formulario[form].pregunta2,
            "pregunta3": formulario[form].pregunta3,
            "pregunta4": formulario[form].pregunta4,
            "pregunta5": formulario[form].pregunta5,
            "pregunta6": formulario[form].pregunta6,
            "pregunta7": formulario[form].pregunta7,
            "_id": formulario[form]._id,
            "personaLlena": formulario[form].personaLlena.nombre
        }
        response.push(newForm);
    }
    return res.send(response);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const formulario = await Formulario.findById(id);
    res.send(formulario);
});

router.post('/', async (req, res) => {
    const formulario = new Formulario(req.body);
    await formulario.save();
    res.json({ status: '200', text: 'Formulario creado exitosamente' });
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    await Formulario.updateOne({ _id: id }, req.body);
    res.json({ status: '200', text: 'Formulario actualizado' });
})

router.delete('/:id', async (req, res) => {
    await Formulario.findByIdAndRemove(req.params.id);
    res.json({ status: '200', text: 'Formulario eliminado' });
});

module.exports = router;