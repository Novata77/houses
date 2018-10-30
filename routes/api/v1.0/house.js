const express = require("express");
const router = express.Router();
const multer = require('multer');
const mongoose = require("mongoose");
var fs = require('fs');

var House = require("../../../database/collections/House");
var Agent = require("../../../database/collections/Agente");
//var School = require("../../../database/collections/escuela");
var IMAGEN = require("../../../database/collections/Galeria");

router.post(/casas\/[a-z0-9]{1,}$/, (req, res) =>{

  var url = req.url;
  var idAge = url.split('/')[2];

  var casa ={
    agenteID: idAge,
    departament : req.body.departament,
    type : req.body.type,
    offer : req.body.offer,
    zone : req.body.zone,
    lat : req.body.lat,
    lng : req.body.lng,
    address : req.body.address,
    price : req.body.price,
    service : req.body.service,
    year : req.body.year,
    bed : req.body.bed,
    bath : req.body.bath,
    details : req.body.details,
    gallery : '',
    video : '',
    other : req.body.other,
    school : ''
  };
  var housData = new House(casa);
  housData.save().then((info) => {
    console.log(info);
    var agentes = {
      ventas : new Array()
    }
    Agent.findOne({_id : idAge}).exec((err, docs)=>{
      console.log(docs);
      var data = docs.ventas;
      var aux = new Array();
      if(data.length == 1 && data[0] == ''){
        agentes.ventas.push('localhost:7770/api/v1.0/casas/' + info._id)
      }else{
        aux.push('localhost:7770/api/v1.0/casas/' + info._id);
        data = data.concat(aux);
        agentes.ventas = data;
      }
      Agent.findOneAndUpdate({_id : idAge}, agentes, (err, params) =>{
        if(err){
          res.status(500).json({
            msn : 'error en la actualizacion casas'
          });
          return;
        }
        res.status(200).json({
             msn : 'registrado casas'
        });
        return;
      });
    });
  }).catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get('/casas', (req, res) =>{
  House.find({}).exec((error, docs) =>{
    res.status(200).json(docs);
  })
});

router.get('/casas/:idCA', (req, res) =>{
  var urlc = req.url;
  var idCA = urlc.split('/')[2];
  House.findOne({_id : idCA}).exec((err, docs) => {
    if (docs != null){
      res.status(200).json(docs);
      return;
    }
    res.status(200).json({
      msn : 'no existe recursos'
    });
  })
});

//CARGAR LA GALERIA DE FOTOS DE LA CASA
var storageh = multer.diskStorage({
  destination: function(req, file, cb) {
  cb(null, './public/houses');
},
filename: function(req, file, cb) {
  console.log('-------------------');
    console.log(file);

  cb(null, new Date().toISOString() + file.originalname);
}
});
var uploadh = multer({
  storage: storageh
});

router.post('/galeriasH/:IDho', uploadh.single('galerias'),(req, res)=> {
  var url = req.url;
  var IDho = url.split('/')[2];
  var rutah = req.file.path.substr(6, req.file.path.length);
  console.log(rutah);

  var galerias = {
    name : req.file.originalname,
    idhouse: IDho,
    physicalpath : req.file.path,
    relativepath : '' + rutah
  };
  var galDATA = new IMAGEN(galerias);
  galDATA.save().then((imagen) =>{
    console.log(imagen);
    var casa = {
      gallery : new Array()
    }
    House.findOne({_id : IDho}).exec((err, docs)=>{
      console.log(docs);
      var dataga = docs.gallery;
      var aux = new Array();
      if(dataga.length == 1 && dataga[0] == ''){
        casa.gallery.push('localhost:7770/api/v1.0/galeriasH/' + imagen._id)
      }else {
        aux.push('localhost:7770/api/v1.0/galeriasH/' + imagen._id);
        dataga = dataga.concat(aux);
        casa.gallery = dataga;
      }
      House.findOneAndUpdate({_id : IDho}, casa, (err, params) =>{
        if(err){
          res.status(500).json({
            msn : 'error'
          });
          return;
        }
        res.status(200).json(
          req.file
        );
        return;
      });
    })
  });
});

router.get(/galeriasH\/[a-z0-9]{1,}$/, (req, res) =>{
  var urlG = req.url;
  var idGA = urlG.split('/')[2];
  IMAGEN.findOne({_id : idGA}).exec((err, docs) =>{
    if(err){
      res.status(500).json({
        msn: 'no carga la imagen'
      });
      return;
    }
    var gal = fs.readFileSync('./' + docs.physicalpath);
    res.contentType('image/jpeg');
    res.status(200).send(gal);
  })
});

router.get('/galeriasH', (req, res) =>{
  IMAGEN.find({}).exec((erros, docs) =>{
    res.status(200).json(docs);
  })
});
module.exports = router;
