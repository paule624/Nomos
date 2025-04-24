import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import categoriesData from "/Data/categories.json";

function PourToi() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const containerRef = useRef(null);

  // State declarations for touch events
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Define all hooks before any conditional logic
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowDown" && currentArticleIndex < articles.length - 1) {
        setCurrentArticleIndex((prev) => prev + 1);
      } else if (e.key === "ArrowUp" && currentArticleIndex > 0) {
        setCurrentArticleIndex((prev) => prev - 1);
      }
    },
    [currentArticleIndex, articles.length]
  );

  // Ajouter des fonctions pour la navigation externe
  const goToPrevArticle = () => {
    if (currentArticleIndex > 0) {
      setCurrentArticleIndex((prev) => prev - 1);
    }
  };

  const goToNextArticle = () => {
    if (currentArticleIndex < articles.length - 1) {
      setCurrentArticleIndex((prev) => prev + 1);
    }
  };

  // Seuil minimum de déplacement pour considérer un swipe (en pixels)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null); // Réinitialiser la position de fin
    setTouchStart(e.touches[0].clientY);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) >= minSwipeDistance;

    if (isSwipe) {
      if (distance > 0 && currentArticleIndex < articles.length - 1) {
        // Swipe vers le haut, aller à l'article suivant
        setCurrentArticleIndex((prev) => prev + 1);
      } else if (distance < 0 && currentArticleIndex > 0) {
        // Swipe vers le bas, aller à l'article précédent
        setCurrentArticleIndex((prev) => prev - 1);
      }
    }
  };

  // All useEffect hooks must be called before any conditional returns
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${user.id}/preferences`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!data.preferences || data.preferences.length === 0) {
          setLoading(false);
          return;
        }

        // Get articles for each category
        const articleRequests = data.preferences.map((categoryId) =>
          axios.get(
            `${import.meta.env.VITE_API_URL}/articles/category/${categoryId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
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
  useEffect(() => {
    // Créer un événement personnalisé pour communiquer l'ID de l'article actuel
    if (articles.length > 0) {
      const event = new CustomEvent("pourtoi-articleChanged", {
        detail: { id: articles[currentArticleIndex].id },
      });
      window.dispatchEvent(event);
    }
  }, [currentArticleIndex, articles]);
  // Ajouter des références aux boutons pour la navigation externe
  useEffect(() => {
    // Créer des éléments invisibles avec des classes pour les boutons externes
    const prevButton = document.createElement("button");
    prevButton.className = "pourtoi-prev";
    prevButton.style.display = "none";
    prevButton.addEventListener("click", goToPrevArticle);

    const nextButton = document.createElement("button");
    nextButton.className = "pourtoi-next";
    nextButton.style.display = "none";
    nextButton.addEventListener("click", goToNextArticle);

    // Ajouter les boutons au DOM
    document.body.appendChild(prevButton);
    document.body.appendChild(nextButton);

    // Nettoyer les éléments lors du démontage du composant
    return () => {
      document.body.removeChild(prevButton);
      document.body.removeChild(nextButton);
    };
  }, [currentArticleIndex, articles.length]);

  const getCategoryColor = (categoryId) => {
    const category = categoriesData.find((cat) => cat.id === categoryId);
    return category?.color || "#22333B";
  };

  const getCategoryIcon = (categoryId) => {
    const category = categoriesData.find((cat) => cat.id === categoryId);
    return category?.icon || null;
  };

  // Now place your conditional returns
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
    <div className="h-full relative">
      <div
        className="hide-scrollbar h-full relative"
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="px-6 py-4 h-full relative">
          {articles.length > 0 && (
            <div
              key={articles[currentArticleIndex].id}
              className="rounded-3xl shadow-md overflow-hidden p-4 relative h-full"
              style={{
                backgroundColor: getCategoryColor(
                  articles[currentArticleIndex].category?.id
                ),
              }}
            >
              {/* Header avec icône, titre et date */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* Icône de catégorie */}
                  {getCategoryIcon(
                    articles[currentArticleIndex].category?.id
                  ) && (
                    <img
                      src={getCategoryIcon(
                        articles[currentArticleIndex].category?.id
                      )}
                      alt={articles[currentArticleIndex].category?.name}
                      className="w-15 h-15 p-2 rounded-full"
                    />
                  )}

                  {/* Titre et catégorie */}
                  <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-[#22333B]">
                      {articles[currentArticleIndex].title}
                    </h2>
                    <span className="text-sm font-medium text-[#22333B]/80">
                      {articles[currentArticleIndex].category?.name}
                    </span>
                  </div>
                </div>

                {/* Date */}
                <span className="text-sm text-[#4B4B4B]/70">
                  {new Date(
                    articles[currentArticleIndex].created_at
                  ).toLocaleDateString("fr-FR")}
                </span>
              </div>

              {/* Container pour l'image et le texte superposé */}
              <div className="relative h-[600px]">
                {articles[currentArticleIndex].image && (
                  <div className="h-[384px]">
                    <img
                      src={articles[currentArticleIndex].image.image_url}
                      alt={articles[currentArticleIndex].title}
                      className="w-full h-full object-cover rounded-3xl"
                    />
                  </div>
                )}
                {/* Div superposée avec le texte */}
                <div
                  className={`absolute w-full transition-all duration-300 cursor-pointer rounded-3xl bg-white/99 bottom-0 p-4
                  ${
                    expandedArticle === articles[currentArticleIndex].id
                      ? "h-150" // Hauteur complète quand expandé
                      : "h-96" // Hauteur initiale (30% de 384px)
                  }`}
                  onClick={() =>
                    setExpandedArticle(
                      expandedArticle === articles[currentArticleIndex].id
                        ? null
                        : articles[currentArticleIndex].id
                    )
                  }
                >
                  <div className="h-full flex flex-col">
                    <div className="mb-4">
                      {" "}
                      {/* Conteneur pour le titre avec marge en bas */}
                      <h3 className="font-semibold text-3xl">
                        <span className="text-[#22333B]">Mieux</span>{" "}
                        <span
                          style={{
                            color: getCategoryColor(
                              articles[currentArticleIndex].category?.id
                            ),
                          }}
                        >
                          comprendre
                        </span>
                      </h3>
                    </div>
                    <div className="flex-grow overflow-hidden">
                      {" "}
                      {/* Conteneur pour le contenu */}
                      <p
                        className={`text-[#4B4B4B] text-sm leading-relaxed
                      ${
                        expandedArticle === articles[currentArticleIndex].id
                          ? "overflow-y-auto h-full"
                          : "line-clamp-2"
                      }`}
                      >
                        {articles[currentArticleIndex].content}
                      </p>
                    </div>

                    {expandedArticle !== articles[currentArticleIndex].id && (
                      <div className="absolute bottom-4 right-4"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {articles.length > 0 && (
          <div className="hidden">
            <span id="pourtoi-article-id">
              {articles[currentArticleIndex].id}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PourToi;
