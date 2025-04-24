import React, { useState, useEffect } from "react";
import axios from "axios";
import categoriesData from "/Data/categories.json";

function DetailsMesLikes({ setActiveTab }) {
  const [likedArticles, setLikedArticles] = useState([]);

  // Récupérer l'ID utilisateur du localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  // Fonction pour charger les articles likés par l'utilisateur
  const fetchLikedArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      // Récupérer toutes les recommandations
      const response = await axios.get("http://localhost:3000/reactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  useEffect(() => {
    if (userId) {
      fetchLikedArticles();
    }
  }, [userId]);

  const handleBack = () => {
    setActiveTab("profil");
  };

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
          Mes articles likés
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {likedArticles.map((article) => {
          const category = categoriesData.find(
            (cat) => cat.id === article.category_id
          );
          return (
            <div
              key={article.id}
              className="relative h-[190px] rounded-lg overflow-hidden shadow-lg p-2"
              style={{ backgroundColor: category ? category.color : "#F2F4F3" }}
            >
              <div className="flex items-center mb-2">
                {category && (
                  <div className="flex items-center gap-2">
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-8 h-8 object-contain"
                    />
                    <h3 className="text-lg font-semibold text-[#22333B]">
                      {article.title}
                    </h3>
                  </div>
                )}
              </div>
              <div
                className="relative h-[130px] rounded-lg overflow-hidden"
                style={{
                  backgroundColor: category ? category.color : "#F2F4F3",
                }}
              >
                {article.image && (
                  <img
                    src={article.image.image_url}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-multiply"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {likedArticles.length === 0 && (
        <p className="text-center text-[#22333B]/70 mt-4">
          Aucun article liké pour le moment
        </p>
      )}
    </div>
  );
}

export default DetailsMesLikes;
