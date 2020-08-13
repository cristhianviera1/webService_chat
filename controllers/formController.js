const express = require('express');
const router = express.Router();
const Form = require('../models/form');

router.get('/', async (req, res) => {

    const form = await Form.find().populate({path: 'personFill', select: 'name'});
    let response = [];
    for (let property in form) {
        let newForm = {
            "FillDate": form[property].FillDate,
            "questionOne": form[property].questionOne,
            "questionTwo": form[property].questionTwo,
            "questionThree": form[property].questionThree,
            "questionFour": form[property].questionFour,
            "questionFive": form[property].questionFive,
            "questionSix": form[property].questionSix,
            "questionSeven": form[property].questionSeven,
            "_id": form[property]._id,
            "personFill": form[property].personFill.name
        }
        response.push(newForm);
    }
    return res.status(200).json({
        error: false,
        data: response
    });
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    const form = await Form.findById(id);
    res.status(200).json({
        error: false,
        msg: form
    });
});

router.post('/', async (req, res) => {
    const form = new Form(req.body);
    await form.save();
    res.status(200).json({
        error: false,
        msg: 'Formulario creado exitosamente'
    });
})

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    await Form.updateOne({_id: id}, req.body);
    res.status(200).json({
        error: false,
        msg: 'Formulario actualizado'
    });
});

router.delete('/:id', async (req, res) => {
    await Form.findByIdAndRemove(req.params.id);
    res.status(200).json({
        error: false,
        msg: 'Formulario eliminado'
    });
});

module.exports = router;