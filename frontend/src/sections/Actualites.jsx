import React, { useState, useEffect } from "react";
import axios from "axios";
import categoriesData from "/Data/categories.json";

function Actualites() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedArticle, setExpandedArticle] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/articles");
        setArticles(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des articles");
        setLoading(false);
      }
    };

    fetchArticles();
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

  return (
    <div className="px-6 py-4 space-y-6 pt-">
      {articles.map((article) => (
        <div
          key={article.id}
          className="rounded-3xl shadow-md overflow-hidden p-4 relative"
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
                  <div className="absolute bottom-2 right-2">
                    <svg
                      className="w-6 h-6 text-[#F2F4F3]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Actualites;
