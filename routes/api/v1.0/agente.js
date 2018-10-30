const express = require("express");
const router = express.Router();
const multer = require('multer');
var fs = require('fs');
var Agent7 = require("../../../database/collections/Agente");
var House = require("../../../database/collections/House");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
  cb(null, './public/agentes');
},
filename: function(req, file, cb) {
  cb(null, new Date().toISOString() + file.originalname);
}
});

var upload = multer({
  storage: storage
});

//INSERTAR AGENTE DE VENTA

router.post("/agentes", upload.single('photo'),(req, res) =>{
  var ruta = req.file.path.substr(6, req.file.path.length);
  var agent ={
    name : req.body.name,
    phone : req.body.phone,
    email : req.body.email,
    password: req.body.password,
    photo : "" + ruta,
    ventas : ""
  };
  var agentData = new Agent7(agent);
  agentData.save().then(result => {
    console.log(result);
    res.status(201).json({
      Agentesss: {
        name: result.name,
        phone: result.phone,
        email: result.email,
        photo: result.photo,
        ventas : result.ventas,
        bienvenido: {
          hola: result.name
        }
      }
    });
  }).catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get('/agentes', (req, res)=>{
  Agent7.find({}).exec((error, docs) =>{
    res.status(200).json(docs);
  })
});

router.get(/agentes\/[a-z0-9]{1,}$/, (req, res) =>{
  var urla = req.url;
  var idAG = urla.split('/')[2];
  Agent7.findOne({_id : idAG}).exec((err, docs) =>{
    if(docs != null){
      res.status(200).json(docs);
      return;
    }
    res.status(200).json({
      msn : 'no hay recursos'
    });
  })
});

module.exports = router;
