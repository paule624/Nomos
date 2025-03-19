import React, { useState, useEffect } from "react";
import axios from "axios";
import categoriesData from "/Data/categories.json";

function PourToi() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedArticle, setExpandedArticle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          setError("Utilisateur non connecté");
          setLoading(false);
          return;
        }

        // Get user preferences
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const { data } = await axios.get(
          `http://localhost:3000/users/${user.id}/preferences`,
          config
        );

        if (!data.preferences || data.preferences.length === 0) {
          setLoading(false);
          return;
        }

        // Get articles for each category
        const articleRequests = data.preferences.map((categoryId) =>
          axios.get(
            `http://localhost:3000/articles/category/${categoryId}`,
            config
          )
        );

        const responses = await Promise.all(articleRequests);
        const allArticles = responses
          .flatMap((response) => response.data)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setArticles(allArticles);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.message ||
            "Erreur lors du chargement de vos articles personnalisés"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryColor = (categoryId) => {
    const category = categoriesData.find((cat) => cat.id === categoryId);
    return category?.color || "#22333B";
  };

  const getCategoryIcon = (categoryId) => {
    const category = categoriesData.find((cat) => cat.id === categoryId);
    return category?.icon || null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#22333B]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-[#22333B]">
          Aucun article ne correspond à vos préférences pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="hide-scrollbar">
      <div className="px-6 py-4 space-y-16 pt-10">
        {articles.map((article) => (
          <div
            key={article.id}
            className="rounded-3xl shadow-md overflow-hidden p-4 relative "
            style={{
              backgroundColor: getCategoryColor(article.category?.id),
            }}
          >
            {/* Header avec icône, titre et date */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                {/* Icône de catégorie */}
                {getCategoryIcon(article.category?.id) && (
                  <img
                    src={getCategoryIcon(article.category?.id)}
                    alt={article.category?.name}
                    className="w-15 h-15 p-2  rounded-full"
                  />
                )}

                {/* Titre et catégorie */}
                <div className="flex flex-col">
                  <h2 className="text-3xl font-bold text-[#22333B]">
                    {article.title}
                  </h2>
                  <span className="text-sm font-medium text-[#22333B]/80">
                    {article.category?.name}
                  </span>
                </div>
              </div>

              {/* Date */}
              <span className="text-sm text-[#4B4B4B]/70">
                {new Date(article.created_at).toLocaleDateString("fr-FR")}
              </span>
            </div>

            {/* Container pour l'image et le texte superposé */}
            <div className="relative h-[600px]">
              {" "}
              {/* Augmenté de 500px à 600px */}
              {article.image && (
                <div className="h-[384px]">
                  {" "}
                  {/* Augmenté et utilisation de valeur exacte */}
                  <img
                    src={article.image.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>
              )}
              {/* Div superposée avec le texte */}
              <div
                className={`absolute w-full transition-all duration-300 cursor-pointer rounded-3xl bg-white/99 bottom-0
                ${
                  expandedArticle === article.id
                    ? "h-150" // Hauteur complète quand expandé
                    : "h-96" // Hauteur initiale (30% de 384px)
                }`}
                onClick={() =>
                  setExpandedArticle(
                    expandedArticle === article.id ? null : article.id
                  )
                }
              >
                <div className="p-4 h-full flex flex-col">
                  <h3 className="font-semibold mb-2 text-3xl">
                    <span className="text-[#22333B]">Mieux</span>{" "}
                    <span
                      style={{ color: getCategoryColor(article.category?.id) }}
                    >
                      comprendre
                    </span>
                  </h3>
                  <p
                    className={`text-[#4B4B4B] text-sm leading-relaxed
                  ${
                    expandedArticle === article.id
                      ? "overflow-y-auto flex-grow"
                      : "line-clamp-2"
                  }`}
                  >
                    {article.content}
                  </p>

                  {expandedArticle !== article.id && (
                    <div className="absolute bottom-2 right-2"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PourToi;
