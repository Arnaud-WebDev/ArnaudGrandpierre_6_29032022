//Importe le modèle Sauce
const Sauce = require("../models/sauce");

//File System : Permet de Créer, Lire, Ecrire, Copier, Renommer ou Supprimer des fichiers
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceForm = JSON.parse(req.body.sauce);
  //Supprime l'id pour remplacer par une id créée par mongoDB
  delete sauceForm._id;
  //Enregistre l'objet sur la base de données mongoDB
  const sauce = new Sauce({
    ...sauceForm,
    imageUrl: `${req.protocol}://${req.get("host")}/image/${req.file.filename}`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceForm = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/image/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceForm, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/image/")[1];
      fs.unlink(`image/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//Section des likes
exports.likeSauce = (req, res, next) => {
  /* console.log("je suis dans le controller like"); */
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    switch (req.body.like) {
      case 1:
        //Les gens qui aiment
        if (
          !sauce.usersLiked.includes(req.body.userId) &&
          req.body.like === 1
        ) {
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

      case -1:
        //Les gens qui n'aiment pas
        if (
          !sauce.usersDisliked.includes(req.body.userId) &&
          req.body.like === -1
        ) {
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
            .catch((error) => res.status(404).json({ error }));
        }

      case 0:
        if (sauce.usersDisliked.includes(req.body.userId)) {
          console.log(req.body.like);
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
            }
          )
            .then(() => res.status(201).json({ message: "dislikeSauce 0" }))
            .catch((error) => res.status(404).json({ error }));
        }
    }
  });
};
