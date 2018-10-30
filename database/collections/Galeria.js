const mongoose = require("../connect");

var galeriaSchema = {
  name : String,
  idhouse: String,
  physicalpath : String,
  relativepath : String
};
var galerias = mongoose.model("galerias", galeriaSchema);
module.exports = galerias;
