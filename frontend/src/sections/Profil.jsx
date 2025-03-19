import React, { useState, useEffect } from "react";
import axios from "axios";
import pdp from "../assets/profil/profil.svg";
import Preferences from "./Preferences";
import categoriesData from "/Data/categories.json";

function Profil({ setActiveTab }) {
  const [showPreferences, setShowPreferences] = useState(false);
  const [userPreferences, setUserPreferences] = useState([]);

  // Récupérer l'ID utilisateur du localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  // Charger les préférences de l'utilisateur
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

        if (response.data.selectedCategories) {
          const selectedIds = response.data.selectedCategories;
          const selectedCategories = selectedIds
            .map((id) => {
              return categoriesData.find((cat) => cat.id === id);
            })
            .filter(Boolean);
          setUserPreferences(selectedCategories);
        }
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
    };

    if (userId) {
      fetchUserPreferences();
    }
  }, [userId]);

  const handleBack = () => {
    if (showPreferences) {
      setShowPreferences(false);
    } else {
      setActiveTab("actualites");
    }
  };

  const handlePreferences = () => {
    setShowPreferences(true);
  };

  if (showPreferences) {
    return <Preferences setShowPreferences={setShowPreferences} />;
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
          Mon profil
        </h1>
      </div>
      <div className="pdp flex items-center justify-center">
        <img src={pdp} alt="Profil" className="w-40 h-40 rounded-full"></img>
      </div>
      <div className="preferences pt-5">
        <div className="title_preference flex justify-between">
          <h2 className="text-[#22333B] font-semibold text-2xl">
            Mes préferences
          </h2>
          <button
            onClick={handlePreferences}
            className="underline text-[#22333B] cursor-pointer font-normal"
          >
            Modifier
          </button>
        </div>
        <div className="cards_preferences grid grid-cols-4 gap-2 mt-4 px-10">
          {[
            ...userPreferences.slice(0, 8),
            ...Array(Math.max(0, 8 - userPreferences.length)),
          ].map((category, index) => (
            <div
              key={category ? category.id : `empty-${index}`}
              onClick={handlePreferences}
              className="w-16 h-16 rounded-full flex items-center  cursor-pointer justify-center bg-[#F2F4F3] shadow-[0_7px_12.5px_-6px_rgba(0,0,0,0.25)]"
            >
              {category ? (
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-13 h-13 object-contain"
                />
              ) : (
                <div className="w-13 h-13 flex items-center justify-center rounded-full  bg-[#F2F4F3] shadow-[0_7px_12.5px_-6px_rgba(0,0,0,0.25)]">
                  <svg
                    className="w-6 h-6 text-[#22333B] "
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 4v16M4 12h16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="my-liked pt-5">
        <div className="title_my_miked flex justify-between">
          <h2 className="text-[#22333B] font-semibold text-2xl">Mes likés</h2>
          <a href="" className="underline text-[#22333B]">
            Voir plus
          </a>
        </div>
        <div className="cards_my_liked"></div>
      </div>
    </div>
  );
}

export default Profil;
