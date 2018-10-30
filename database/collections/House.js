const mongoose = require("../connect");

var casaSchema ={
agenteID: String,
departament : String,
type : String, //terreno/casa/departamento/
offer : String,  //venta alquiler/anticretico
zone : String,
lat : Number,
lng : Number,
address : String,
price : Number,
service : String,
year : Number,
bed : Number,
bath : Number,
details : String,
gallery : Array,
video : Array,
other : String,
school : Array
};
var casa = mongoose.model("casa", casaSchema);
module.exports = casa;
