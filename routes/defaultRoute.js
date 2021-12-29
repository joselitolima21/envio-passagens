const express = require('express');
//const { celebrate, Segments, Joi} = require('celebrate');
const defaultCon = require('../controllers/defaultCon.js');

const router = express.Router();

router.post('/',defaultCon.post);
/* router.post('/',celebrate({ 
    [Segments.BODY]: Joi.object().keys({
            placa: Joi.string().required().max(7),
            tipoVeiculo: Joi.string().max(30),
            velocidade: Joi.number(),
            dataHora: Joi.string().required(),
            idImagem: Joi.string(),
            acertoImagem: Joi.number(),
            cameraNumero: Joi.string().required(),
            cameraLatitude: Joi.number(),
            cameraLongitude: Joi.number(),
        })
    }),defaultCon.post);
*/

module.exports = router;