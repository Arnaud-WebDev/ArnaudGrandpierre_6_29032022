//Permet de crypter un mot de passe grâce à la fonction '.hash()'
const bcrypt = require("bcrypt");

//Importe le package jsonwebtoken
const jwt = require("jsonwebtoken");

//Importe le model User
const User = require("../models/User");

//Enregistre un nouvel utilisateur
exports.signup = (req, res, next) => {
  //« sale » le mot de passe 10 fois. Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      //Enregistre l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur crée !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Connecte un utilisateur existant
exports.login = (req, res, next) => {
  //Permet de trouver un utilisateur dans la base de données grâce à son adresse mail
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId:
              user._id /* Permet de ne pas modifier les objets des autres utilisateurs grace au filtre ID */,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    //Renvoi un erreur server
    .catch((error) => res.status(500).json({ error }));
};
