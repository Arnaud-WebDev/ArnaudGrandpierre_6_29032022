// Importe le package multer
const multer = require("multer");

// Objet qui va permettre de créer l'extension du fichier
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// Création d'objet de configuration pour multer
// diskStorage permet de dire que l'on va l'enregister sur le disque
const storage = multer.diskStorage({
  // "destination" va nous permettre de dire dans quel dossier placer les photos"
  destination: (req, file, callback) => {
    callback(null, "images/");
  },
  // "filename" va générer le nouveau du fichier pour éviter d'avoir 2 fois les mêmes tout en gardant le nom original
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    // Création du nom du fichier avec un timestamp pour le rendre unique avec Date.now() qui renvoie le nombre de millisecondes écoulées depuis le 1er Janvier 1970
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage }).single("image");
