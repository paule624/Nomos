const bcrypt = require("bcrypt");
const User = require("../models/user");

const createUser = async (data) => {
  // Validation de l'email
  const existingUser = await User.findOne({ where: { email: data.email } });
  if (existingUser) throw new Error("L'email est déjà pris.");

  // Validation du mot de passe (exemple de complexité)
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(data.password)) {
    throw new Error(
      "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial."
    );
  }

  // Hashage du mot de passe
  const hashedPassword = await bcrypt.hash(data.password, 10); // 10 est le nombre de tours du salage (à ajuster en fonction de la sécurité requise)

  // Remplacer le mot de passe en clair par le mot de passe hashé
  data.password = hashedPassword;

  try {
    return await User.create(data);
  } catch (error) {
    throw new Error(
      "Erreur lors de la création de l'utilisateur : " + error.message
    );
  }
};

const getAllUsers = async () => {
  try {
    return await User.findAll();
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des utilisateurs : " + error.message
    );
  }
};

const getUserById = async (id) => {
  try {
    return await User.findByPk(id);
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération de l'utilisateur : " + error.message
    );
  }
};

const updateUser = async (id, data) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;

    // Si le mot de passe est fourni, on le hash avant de mettre à jour
    if (data.password && typeof data.password === "string") {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    // Mise à jour de l'utilisateur avec les nouvelles données
    await user.update(data);
    return user;
  } catch (error) {
    throw new Error(
      "Erreur lors de la mise à jour de l'utilisateur : " + error.message
    );
  }
};

const deleteUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.destroy();
    return true;
  } catch (error) {
    throw new Error(
      "Erreur lors de la suppression de l'utilisateur : " + error.message
    );
  }
};

const getUserPreferences = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;

    return user.selectedCategories || [];
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des préférences : " + error.message
    );
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserPreferences,
};
