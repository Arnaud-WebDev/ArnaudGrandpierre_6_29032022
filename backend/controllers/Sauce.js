// Importe le modèle Sauce
const Sauce = require("../models/sauce");

// File System : Permet de Créer, Lire, Ecrire, Copier, Renommer ou Supprimer des fichiers
const fs = require("fs");

// Création des sauces
exports.createSauce = (req, res, next) => {
  const sauceForm = JSON.parse(req.body.sauce);
  //Supprime l'id pour remplacer par une id créée par mongoDB
  delete sauceForm._id;
  //Enregistre l'objet sur la base de données mongoDB
  const sauce = new Sauce({
    ...sauceForm,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Modification des sauces
exports.modifySauce = (req, res, next) => {
  const sauceForm = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceForm, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
};

// Suppression des sauces
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Section des likes
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // req.body.like prend la valeur du like
      switch (req.body.like) {
        //Les gens qui aiment
        case 1:
          // Verifie si l'userId n'est pas présent le "!" permet d'avoir true sur l'instruction
          if (!sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId },
              }
            )
              .then(() => res.status(201).json({ message: "likeSauce +1" }))
              .catch((error) => res.status(404).json({ error }));
          }
          break;

        //Les gens qui n'aiment pas
        case -1:
          if (!sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
              }
            )
              .then(() => res.status(201).json({ message: "dislikeSauce +1" }))
              .catch((error) => res.status(404).json({ error }));
          }
          break;

          // Ramène le like a 0
        case 0:
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId },
              }
            )
              .then(() => res.status(201).json({ message: "likeSauce 0" }))
              .catch((error) => res.status(400).json({ error }));
          }

          // Ramène le dislike a 0
          if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
              }
            )
              .then(() => res.status(201).json({ message: "dislikeSauce 0" }))
              .catch((error) => res.status(400).json({ error }));
          }
          break;
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
