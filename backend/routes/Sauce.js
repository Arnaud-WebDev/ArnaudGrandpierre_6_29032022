const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/Sauce");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//Permet de trouver tous les objets
router.get("/", auth, sauceCtrl.getAllSauces);

//Crée un nouvel objet
router.post("/", auth, multer, sauceCtrl.createSauce);

//Permet de trouver un objet via son ID
router.get("/:id", auth, sauceCtrl.getOneSauce);

//Permet de modifier/mettre à jour un objet dans la base de données
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

//Permet de supprimer un objet
router.delete("/:id", auth, sauceCtrl.deleteSauce);

//Permet de liker les sauces
router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;
