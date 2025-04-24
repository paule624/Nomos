import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import categoriesData from "/Data/categories.json";
import Footer from "../components/Footer";

function MesLikes({ setShowLikes }) {
  const [likedArticles, setLikedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const containerRef = useRef(null);

  // State pour les événements tactiles
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Récupérer l'ID utilisateur du localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id;

  // Fonction de navigation avec le clavier
  const handleKeyDown = useCallback(
    (e) => {
      if (
        e.key === "ArrowDown" &&
        currentArticleIndex < likedArticles.length - 1
      ) {
        setCurrentArticleIndex((prev) => prev + 1);
      } else if (e.key === "ArrowUp" && currentArticleIndex > 0) {
        setCurrentArticleIndex((prev) => prev - 1);
      }
    },
    [currentArticleIndex, likedArticles.length]
  );

  // Fonctions pour la navigation externe
  const goToPrevArticle = () => {
    if (currentArticleIndex > 0) {
      setCurrentArticleIndex((prev) => prev - 1);
    }
  };

  const goToNextArticle = () => {
    if (currentArticleIndex < likedArticles.length - 1) {
      setCurrentArticleIndex((prev) => prev + 1);
    }
  };

  // Configuration du swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
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
      if (distance > 0 && currentArticleIndex < likedArticles.length - 1) {
        // Swipe vers le haut, aller à l'article suivant
        setCurrentArticleIndex((prev) => prev + 1);
      } else if (distance < 0 && currentArticleIndex > 0) {
        // Swipe vers le bas, aller à l'article précédent
        setCurrentArticleIndex((prev) => prev - 1);
      }
    }
  };

  // Ajouter l'écouteur pour les touches directionnelles
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Charger les articles likés
  useEffect(() => {
    const fetchLikedArticles = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Récupérer toutes les recommendations (qui servent de likes)
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/recommendations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filtrer les recommendations pour cet utilisateur
        const userRecommendations = response.data.filter(
          (rec) => rec.user_id === userId
        );

        if (userRecommendations.length === 0) {
          setLikedArticles([]);
          setLoading(false);
          return;
        }

        // Récupérer les détails des articles
        const articleIds = userRecommendations.map((rec) => rec.article_id);
        const articlesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/articles`,
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

        // Trier par date (du plus récent au plus ancien)
        const sortedArticles = likedArticles.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setLikedArticles(sortedArticles);
      } catch (error) {
        console.error("Error fetching liked articles:", error);
        setError("Erreur lors du chargement des articles likés");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchLikedArticles();
    }
  }, [userId]);

  // Ajouter des références aux boutons pour la navigation externe
  useEffect(() => {
    // Créer des éléments invisibles avec des classes pour les boutons externes
    const prevButton = document.createElement("button");
    prevButton.className = "meslikes-prev";
    prevButton.style.display = "none";
    prevButton.addEventListener("click", goToPrevArticle);

    const nextButton = document.createElement("button");
    nextButton.className = "meslikes-next";
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
  }, [currentArticleIndex, likedArticles.length]);

  const handleBack = () => {
    setShowLikes(false);
  };

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
    <div className="h-full px-6 py-4 relative">
      {/* Hero avec titre et bouton retour */}
      <div className="hero flex justify-center  relative drop-shadow-[0_3px_7.7px_rgba(0,0,0,0.25)] mt-5">
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
          Mes likés
        </h1>
      </div>

      {likedArticles.length === 0 ? (
        <div className="flex justify-center items-center h-64 px-6">
          <p className="text-[#22333B]/70 text-center">
            Vous n'avez pas encore liké d'articles.
            <br />
            Explorez notre contenu et likez les articles qui vous intéressent !
          </p>
        </div>
      ) : (
        <div
          className="hide-scrollbar h-[calc(100%-clamp(100px,15vh,150px))] relative"
          ref={containerRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="h-full relative">
            {likedArticles.length > 0 && (
              <div
                key={likedArticles[currentArticleIndex].id}
                className="rounded-3xl shadow-md overflow-hidden p-4 relative h-full flex flex-col"
                style={{
                  backgroundColor: getCategoryColor(
                    likedArticles[currentArticleIndex].category_id
                  ),
                }}
              >
                {/* Header avec icône, titre et date - taille dynamique et auto */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    {/* Icône de catégorie */}
                    {getCategoryIcon(
                      likedArticles[currentArticleIndex].category?.id
                    ) && (
                      <img
                        src={getCategoryIcon(
                          likedArticles[currentArticleIndex].category?.id
                        )}
                        alt={likedArticles[currentArticleIndex].category?.name}
                        className="w-15 h-15 p-2 rounded-full"
                      />
                    )}

                    {/* Titre et catégorie */}
                    <div className="flex flex-col">
                      <h2 className="text-xl font-bold text-[#22333B]">
                        {likedArticles[currentArticleIndex].title}
                      </h2>
                      <span className="text-sm font-medium text-[#22333B]/80">
                        {likedArticles[currentArticleIndex].category?.name}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <span className="text-sm text-[#4B4B4B]/70">
                    {new Date(
                      likedArticles[currentArticleIndex].created_at
                    ).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                {/* Container pour l'image et le texte superposé - avec espace flexible */}
                <div className="relative flex-grow">
                  {likedArticles[currentArticleIndex].image && (
                    <div className="h-[384px]">
                      <img
                        src={likedArticles[currentArticleIndex].image.image_url}
                        alt={likedArticles[currentArticleIndex].title}
                        className="w-full h-full object-cover rounded-3xl"
                      />
                    </div>
                  )}
                  {/* Div superposée avec le texte */}
                  <div
                    className={`absolute w-full transition-all duration-300 cursor-pointer rounded-3xl bg-white/99 bottom-0 p-4
                    ${
                      expandedArticle === likedArticles[currentArticleIndex].id
                        ? "h-150"
                        : "h-96"
                    }`}
                    onClick={() =>
                      setExpandedArticle(
                        expandedArticle ===
                          likedArticles[currentArticleIndex].id
                          ? null
                          : likedArticles[currentArticleIndex].id
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
                                likedArticles[currentArticleIndex].category?.id
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
                        expandedArticle ===
                        likedArticles[currentArticleIndex].id
                          ? "overflow-y-auto h-full"
                          : "line-clamp-2"
                      }`}
                        >
                          {likedArticles[currentArticleIndex].content}
                        </p>
                      </div>

                      {expandedArticle !==
                        likedArticles[currentArticleIndex].id && (
                        <div className="absolute bottom-4 right-4"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Exposer l'ID de l'article actuel pour le composant parent */}
          {likedArticles.length > 0 && (
            <div className="hidden">
              <span id="meslikes-article-id">
                {likedArticles[currentArticleIndex].id}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Boutons de navigation */}
      {likedArticles.length > 0 && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-50">
          <button
            onClick={goToPrevArticle}
            className="p-3 rounded-full bg-white/80 hover:bg-white text-[#22333B] shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
            aria-label="Article précédent"
            disabled={currentArticleIndex === 0}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
          <button
            onClick={goToNextArticle}
            className="p-3 rounded-full bg-white/80 hover:bg-white text-[#22333B] shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
            aria-label="Article suivant"
            disabled={currentArticleIndex === likedArticles.length - 1}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Footer positionné au centre en bas */}
      {likedArticles.length > 0 && (
        <div className="absolute bottom-[clamp(10px,4vh,80px)] left-0 right-0 mx-auto w-full flex justify-center">
          <Footer
            articleId={likedArticles[currentArticleIndex].id}
            onCategoryClick={() => {}}
          />
        </div>
      )}
    </div>
  );
}

export default MesLikes;
