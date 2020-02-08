const express = require('express');
const router = express.Router();
const Producto = require('../models/productos');

router.get('/', async (req, res) => {

    const producto = await Producto.find();
    res.send(producto);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const producto = await Producto.findById(id);
    res.send(producto);
});

router.post('/', async (req, res) => {
    const producto = new Producto(req.body);
    await producto.save();
    res.json({status: '200', text: 'Producto creado exitosamente'});
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    await Producto.updateOne({_id : id}, req.body);
    res.json({status: '200', text: 'Producto actualizado'});
})

router.delete('/:id', async (req, res) => {
    await Producto.findByIdAndRemove(req.params.id);
  res.json({status: '200', text: 'Producto eliminado'});
});

module.exports = router;