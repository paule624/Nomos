/**
 * Convertit une chaîne en slug (URL-friendly)
 * @param {string} text - Texte à convertir en slug
 * @returns {string} - Slug généré
 */
exports.slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/[^\w\-]+/g, "") // Supprime les caractères non-word
    .replace(/\-\-+/g, "-") // Remplace les tirets multiples par un seul
    .replace(/^-+/, "") // Supprime les tirets au début
    .replace(/-+$/, ""); // Supprime les tirets à la fin
};
