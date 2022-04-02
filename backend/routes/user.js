//Express nous permet de créer un router avec la fonction ".Router()"
const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

// "/signup" ou "/login" est  uniquement le segment final, car le reste de l'adresse de la route sera déclaré dans notre application Express.
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
