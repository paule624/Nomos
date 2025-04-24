const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Inscription d'un nouvel utilisateur
const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe requis",
        success: false,
      });
    }

    // Vérifier si l'utilisateur existe déjà
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          message: "Cet email est déjà utilisé",
          success: false,
        });
      }
    } catch (dbError) {
      console.error("Erreur lors de la vérification d'email:", dbError);
      return res.status(500).json({
        message:
          "Erreur de connexion à la base de données. Veuillez réessayer plus tard.",
        error:
          process.env.NODE_ENV === "production" ? undefined : dbError.message,
        success: false,
      });
    }

    // Hasher le mot de passe
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error("Erreur lors du hashage du mot de passe:", hashError);
      return res.status(500).json({
        message: "Erreur lors de la création de l'utilisateur",
        success: false,
      });
    }

    // Créer l'utilisateur
    let user;
    try {
      user = await User.create({
        email,
        password: hashedPassword,
        first_name: first_name || null,
        last_name: last_name || null,
        role: role || "user",
      });
    } catch (createError) {
      console.error(
        "Erreur lors de la création de l'utilisateur:",
        createError
      );
      return res.status(500).json({
        message: "Erreur lors de la création de l'utilisateur",
        error:
          process.env.NODE_ENV === "production"
            ? undefined
            : createError.message,
        success: false,
      });
    }

    // Générer un token JWT
    let token;
    try {
      token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET ||
          "2737ef18066ace929a2a5edd8cf8de60a8dffbfd0d8534b079fdc64c12d7b73cf529a7c9f43a65de49d533cf8a3d1487fa8aa7a6574695879d220a632a7369c9",
        { expiresIn: "24h" }
      );
    } catch (tokenError) {
      console.error("Erreur lors de la génération du token:", tokenError);
      return res.status(500).json({
        message: "Erreur lors de la génération du token",
        success: false,
      });
    }

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
      success: true,
    });
  } catch (error) {
    console.error("Erreur non gérée lors de l'inscription:", error);
    res.status(500).json({
      message: "Une erreur inattendue est survenue lors de l'inscription",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
      success: false,
    });
  }
};

// Connexion d'un utilisateur
const login = async (req, res) => {
  try {
    console.log("Tentative de connexion avec email:", req.body.email);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Email ou mot de passe manquant");
      return res.status(400).json({
        message: "Email et mot de passe requis",
        success: false,
      });
    }

    // Vérifier si l'utilisateur existe
    let user;
    try {
      console.log("Recherche de l'utilisateur dans la base de données...");
      user = await User.findOne({ where: { email } });
      if (!user) {
        console.log("Utilisateur non trouvé:", email);
        return res.status(401).json({
          message: "Email ou mot de passe incorrect",
          success: false,
        });
      }
      console.log("Utilisateur trouvé avec l'ID:", user.id);
    } catch (dbError) {
      console.error("Erreur lors de la recherche de l'utilisateur:", dbError);
      return res.status(500).json({
        message:
          "Erreur de connexion à la base de données. Veuillez réessayer plus tard.",
        error:
          process.env.NODE_ENV === "production" ? undefined : dbError.message,
        success: false,
      });
    }

    // Vérifier le mot de passe
    let isPasswordValid;
    try {
      console.log("Vérification du mot de passe...");
      isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("Mot de passe invalide pour:", email);
        return res.status(401).json({
          message: "Email ou mot de passe incorrect",
          success: false,
        });
      }
      console.log("Mot de passe valide");
    } catch (bcryptError) {
      console.error(
        "Erreur lors de la vérification du mot de passe:",
        bcryptError
      );
      return res.status(500).json({
        message: "Erreur lors de la vérification des identifiants",
        success: false,
      });
    }

    // Générer un token JWT
    let token;
    try {
      console.log("Génération du token JWT...");
      const jwtSecret =
        process.env.JWT_SECRET ||
        "2737ef18066ace929a2a5edd8cf8de60a8dffbfd0d8534b079fdc64c12d7b73cf529a7c9f43a65de49d533cf8a3d1487fa8aa7a6574695879d220a632a7369c9";

      console.log("JWT Secret disponible:", !!jwtSecret);

      token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: "24h" }
      );
      console.log("Token généré avec succès");
    } catch (tokenError) {
      console.error("Erreur lors de la génération du token:", tokenError);
      return res.status(500).json({
        message: "Erreur lors de la génération du token",
        success: false,
      });
    }

    console.log("Connexion réussie pour:", email);

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
      success: true,
    });
  } catch (error) {
    console.error("Erreur non gérée lors de la connexion:", error);
    res.status(500).json({
      message: "Une erreur inattendue est survenue lors de la connexion",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
      success: false,
    });
  }
};

// Récupérer les informations de l'utilisateur connecté
const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Non autorisé",
        success: false,
      });
    }

    let user;
    try {
      user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
      });
    } catch (dbError) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur:",
        dbError
      );
      return res.status(500).json({
        message: "Erreur de connexion à la base de données",
        error:
          process.env.NODE_ENV === "production" ? undefined : dbError.message,
        success: false,
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
        success: false,
      });
    }

    res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.error("Erreur non gérée dans getMe:", error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des informations utilisateur",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
      success: false,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
