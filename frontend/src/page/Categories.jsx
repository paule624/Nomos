import React, { useState, useEffect } from "react";
import axios from "axios";
import categoriesData from "/Data/categories.json";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories");

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
      <h1 className="text-3xl font-[Bold_Dispo] mb-8 text-[#22333B]">
        Catégories
      </h1>

      <div className="flex flex-col space-y-4 w-full">
        {categories.map((category) => (
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
