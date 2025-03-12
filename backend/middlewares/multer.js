const multer = require("multer");

// Multer en mode mémoire (pas de stockage sur disque)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;
