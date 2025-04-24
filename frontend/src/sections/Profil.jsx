import React, { useState, useEffect } from "react";
import axios from "axios";
import pdp from "../assets/profil/profil.svg";
import Preferences from "./Preferences";
import categoriesData from "/Data/categories.json";
import MesLikes from "./MesLikes";
import { logout } from "../utils/auth";

function Profil({ setActiveTab }) {
  const [showPreferences, setShowPreferences] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [userPreferences, setUserPreferences] = useState([]);
  const [likedArticles, setLikedArticles] = useState([]);

  // Récupérer l'ID utilisateur du localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  // Fonction pour charger les préférences de l'utilisateur
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

  // Fonction pour charger les articles likés par l'utilisateur
  const fetchLikedArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      // Récupérer toutes les recommandations
      const response = await axios.get(
        "http://localhost:3000/recommendations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Filtrer les recommandations pour cet utilisateur
      const userRecommendations = response.data.filter(
        (rec) => rec.user_id === userId
      );

      // Récupérer les détails des articles
      if (userRecommendations.length > 0) {
        const articleIds = userRecommendations.map((rec) => rec.article_id);
        const articlesResponse = await axios.get(
          "http://localhost:3000/articles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filtrer les articles pour ne garder que ceux qui ont été likés
        const likedArticles = articlesResponse.data.filter((article) =>
          articleIds.includes(article.id)
        );

        setLikedArticles(likedArticles);
      }
    } catch (error) {
      console.error("Error fetching liked articles:", error);
    }
  };

  // Charger les préférences et les articles likés au chargement initial
  useEffect(() => {
    if (userId) {
      fetchUserPreferences();
      fetchLikedArticles();
    }
  }, [userId]);

  // Recharger les préférences et les articles likés quand on revient de la page Preferences ou Likes
  useEffect(() => {
    if (!showPreferences && !showLikes && userId) {
      fetchUserPreferences();
      fetchLikedArticles();
    }
  }, [showPreferences, showLikes, userId]);

  const handleBack = () => {
    if (showPreferences) {
      setShowPreferences(false);
    } else if (showLikes) {
      setShowLikes(false);
    } else {
      setActiveTab("actualites");
    }
  };

  const handlePreferences = () => {
    setShowPreferences(true);
  };

  // Fonction pour déconnexion
  const handleLogout = () => {
    logout();
    setActiveTab("no-log");
  };

  if (showPreferences) {
    return <Preferences setShowPreferences={setShowPreferences} />;
  }

  if (showLikes) {
    return <MesLikes setShowLikes={setShowLikes} />;
  }

  return (
    <div className="px-6 py-4 w-full h-full flex flex-col">
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
        <img
          src={pdp}
          alt="Profil"
          className="w-40 h-40 md:w-56 md:h-56 "
        ></img>
      </div>
      <div className="preferences ">
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
        <div className="cards_preferences grid grid-cols-5 gap-2 mt-4 px-10">
          {[
            ...userPreferences.slice(0, 10),
            ...Array(Math.max(0, 10 - userPreferences.length)),
          ].map((category, index) => (
            <div
              key={category ? category.id : `empty-${index}`}
              onClick={handlePreferences}
              className="w-16 h-16 rounded-full flex items-center cursor-pointer justify-center bg-[#F2F4F3] shadow-[0_7px_12.5px_-6px_rgba(0,0,0,0.25)]"
            >
              {category ? (
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-13 h-13 object-contain"
                />
              ) : (
                <div className="w-13 h-13 flex items-center justify-center rounded-full bg-[#F2F4F3] shadow-[0_7px_12.5px_-6px_rgba(0,0,0,0.25)]">
                  <svg
                    className="w-6 h-6 text-[#22333B]"
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
          <button
            onClick={() => setShowLikes(true)}
            className="underline text-[#22333B] cursor-pointer"
          >
            Voir plus
          </button>
        </div>
        <div
          className="overflow-x-auto pb-4 mt-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex space-x-4">
            {likedArticles.length > 0 ? (
              likedArticles.slice(0, 3).map((article) => {
                const category = categoriesData.find(
                  (cat) => cat.id === article.category_id
                );
                return (
                  <div
                    key={article.id}
                    className="relative h-[285px] w-[226px] flex-shrink-0 rounded-2xl overflow-hidden shadow-lg"
                    style={{
                      backgroundColor: category ? category.color : "#F2F4F3",
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col h-full p-3">
                      {/* Hero div avec picto et titre sur la même ligne */}
                      <div className="flex items-start gap-3 mb-2">
                        {category && (
                          <img
                            src={category.icon}
                            alt={category.name}
                            className="w-9 h-9 object-contain flex-shrink-0"
                          />
                        )}
                        <h3 className="text-lg font-semibold text-[#22333B] line-clamp-2">
                          {article.title}
                        </h3>
                      </div>

                      {/* Div de l'image avec les dimensions réduites */}
                      {article.image && (
                        <div
                          className="w-[201px] h-[192px] mx-auto mt-auto overflow-hidden shadow-[0_1.3px_3.94px_0.87px_rgba(0,0,0,0.25)] rounded-2xl cursor-pointer"
                          onClick={() => setShowLikes(true)}
                        >
                          <img
                            src={article.image.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-[#22333B]/70 w-full">
                Aucun article liké pour le moment
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section déconnexion et copyright visible uniquement sur mobile */}
      <div className="mt-auto pt-10 pb-4 md:hidden">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#22333B]/10 hover:bg-[#22333B]/20 text-[#22333B] px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Déconnexion</span>
          </button>
          <p className="text-[#22333B]/60 text-sm mt-2">© Nomos 2025</p>
        </div>
      </div>
    </div>
  );
}

export default Profil;
