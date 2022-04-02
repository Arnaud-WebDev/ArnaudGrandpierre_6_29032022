const mongoose = require("mongoose");

//Permet de résoudre plus facilement les erreurs générées par MongoDB
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true /* Permet de ne pas avoir plusieurs fois la même adresse mail */,
  },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

//Export le schéma sous forme de modèle
module.exports = mongoose.model("User", userSchema);
