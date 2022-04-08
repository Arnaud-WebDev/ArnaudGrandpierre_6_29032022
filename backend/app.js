const dotenv = require("dotenv").config();
console.log(dotenv.parsed);

//Permet d'importer mongoose dans l'app, Mongoose est un package qui facilite les interactions avec notre base de données MongoDB.
const mongoose = require("mongoose");

//Importe express
const express = require("express");

const path = require("path");

const sauceRoutes = require("./routes/Sauce");
const userRoutes = require("./routes/user");

//Permet de créer un application express
const app = express();

module.exports = mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

/************** MIDDLEWARE **************/
//Remplace body.parser, permet d'analyser le corps de la requête
app.use(express.json());

// prettier-ignore
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
     next();
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

/************** FIN MIDDLEWARE **************/
module.exports = app;
