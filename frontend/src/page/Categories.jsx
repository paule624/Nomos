import React, { useState, useEffect } from "react";
import axios from "axios";
import categoriesData from "/Data/categories.json";
import DetailCategories from "../sections/Detail_Categories";

function Categories({ setActiveTab, setSelectedCategoryId }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/categories`
        );

        // Map backend categories with local data
        const mappedCategories = response.data.map((backendCategory) => {
          // Find matching category in local data by ID
          const localCategory = categoriesData.find(
            (cat) => cat.id === backendCategory.id
          );

          // Extract category name from the icon path if local match is found
          let categoryName = backendCategory.name;
          if (localCategory) {
            const iconPath = localCategory.icon;
            const iconName = iconPath.split("/").pop().split(".")[0];
            categoryName = iconName;
          }

          // Merge backend data with local data
          return {
            ...backendCategory,
            name: categoryName,
            color: localCategory ? localCategory.color : "#CCCCCC",
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

  const handleBack = () => {
    setActiveTab("actualites"); // Retour à l'onglet actualités
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setActiveTab("detail_categories");
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="px-6 py-4 w-full ">
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

      <p className="text-s italic">
        Vous pouvez retrouvez tout les articles de Nomos dans le catalogue.
      </p>
      <div className="flex flex-col space-y-4 w-full cursor-pointer">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="w-full p-2 rounded-full shadow-md transition-all hover:shadow-lg flex items-center justify-between"
            style={{ backgroundColor: `${category.color}` }}
            onClick={() => handleCategoryClick(category.id)}
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

            <div className="bg-white/50 w-12 h-12 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[#22333B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
