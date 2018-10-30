const mongoose = require("../connect");

var agenteSchema = {
  name : String,
  phone : String,
  email : String,
  password : String,
  photo : String,
  ventas : Array
};
var agentes = mongoose.model("agentes", agenteSchema);
module.exports = agentes;
