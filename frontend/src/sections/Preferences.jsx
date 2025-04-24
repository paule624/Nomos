import React, { useState, useEffect } from "react";
import axios from "axios";
import categoriesData from "/Data/categories.json";

function Preferences({ setShowPreferences }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Récupérer l'ID utilisateur du localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  // Gérer la sélection/désélection d'une catégorie
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Sauvegarder les préférences
  const savePreferences = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/users/${userId}`,
        {
          selectedCategories: selectedCategories,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowPreferences(false); // Retour au profil après sauvegarde
    } catch (error) {
      console.error("Error saving preferences:", error);
      setError("Failed to save preferences");
    }
  };

  const handleBack = () => {
    setShowPreferences(false); // Retour au profil
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories");

        // Map backend categories with local data
        const mappedCategories = response.data.map((backendCategory) => {
          const localCategory = categoriesData.find(
            (cat) => cat.id === backendCategory.id
          );

          return {
            ...backendCategory,
            name: backendCategory.name,
            color: localCategory ? localCategory.color : "#CCCCCC",
            dark_color: localCategory ? localCategory.dark_color : "#22333B", // Ajout de dark_color
            icon: localCategory
              ? localCategory.icon
              : "/assets/icons/default.svg",
          };
        });

        setCategories(mappedCategories);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Charger les catégories sélectionnées de l'utilisateur
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Initialiser selectedCategories avec les préférences existantes
        if (response.data.selectedCategories) {
          setSelectedCategories(response.data.selectedCategories);
        }
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
    };

    if (userId) {
      fetchUserPreferences();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22333B]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center p-4">
          <p>{error}</p>
          <button
            className="mt-4 bg-[#22333B] text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 w-full">
      <div className="hero flex justify-center relative drop-shadow-[0_3px_7.7px_rgba(0,0,0,0.25)] mt-5">
        <button
          onClick={handleBack}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[white]/50 hover:bg-white/70 transition-colors justify-center"
        >
          <svg
            className="w-6 h-6 text-[#22333B]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold mb-8 text-[#22333B] justify-center pt-5">
          Le catalogue
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 mt-5">
        <input
          type="text"
          placeholder="Rechercher une catégorie..."
          className="w-full py-2 pl-10 pr-4 rounded-full bg-[#DBDBDB]/80 text-[#22333B] placeholder-[#22333B]/70 focus:outline-none focus:ring-2 focus:ring-[#DBDBDB]/50 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#22333B]/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <p className="text-s italic pb-4">
        Vous pouvez retrouvez tout les articles de Nomos dans le catalogue.
      </p>
      <div className="flex flex-col space-y-4 w-full mb-20">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="w-full p-2 rounded-full shadow-md transition-all hover:shadow-lg flex items-center justify-between"
            style={{ backgroundColor: `${category.color}` }}
          >
            <div className="flex items-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mr-4 overflow-hidden"
                style={{ backgroundColor: category.color }}
              >
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h2 className="text-xl font-semibold text-[#22333B]">
                {category.name}
              </h2>
            </div>

            <button
              onClick={() => toggleCategory(category.id)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                selectedCategories.includes(category.id) ? "text-white" : ""
              }`}
              style={{
                backgroundColor: selectedCategories.includes(category.id)
                  ? category.dark_color
                  : "#F2F4F3",
              }}
            >
              {selectedCategories.includes(category.id) ? (
                <svg className="w-6 h-6" viewBox="0 0 72 55" fill="none">
                  <path
                    d="M22.8361 30.0068L13.1773 20.2264C10.9605 17.9816 7.37424 17.9816 5.15739 20.2264L1.66655 23.7612C-0.550307 26.006 -0.550307 29.6374 1.66655 31.8822L22.8417 53.3241C25.0585 55.5689 28.6448 55.5689 30.8617 53.3241L38.3653 45.726L70.3441 13.3443C72.5609 11.0995 72.5609 7.46807 70.3441 5.22329L66.8532 1.68847C64.6364 -0.556313 61.0501 -0.556313 58.8333 1.68847L30.8617 30.0125C28.6448 32.2573 25.0585 32.2573 22.8417 30.0125L22.8361 30.0068Z"
                    fill="#F2F4F3"
                  />
                </svg>
              ) : null}
            </button>
          </div>
        ))}
      </div>

      {/* Bouton de sauvegarde fixe en bas */}
      <button
        onClick={savePreferences}
        className="w-full py-3 bg-[#22333B] text-white rounded-full font-semibold hover:bg-[#22333B]/90 transition-colors"
      >
        Sauvegarder mes préférences
      </button>
    </div>
  );
}

export default Preferences;
