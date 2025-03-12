// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// Route pour obtenir toutes les catégories
router.get("/", categoryController.getCategorys);

// Route pour créer une catégories
router.post("/", categoryController.createCategory);

router.put("/:id", categoryController.putCategory); 
router.delete("/:id", categoryController.deleteCategory);


module.exports = router;
