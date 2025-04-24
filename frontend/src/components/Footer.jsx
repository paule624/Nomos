import React, { useState, useEffect } from "react";
import axios from "axios";
import Like from "../assets/Footer/Like.svg";
import Send from "../assets/Footer/Send.svg";
import Category from "../assets/Footer/Category.svg";
import HoverLike from "../assets/Footer/hover_Like.svg";
import HoverSend from "../assets/Footer/hover_Send.svg";
import HoverCategory from "../assets/Footer/hover_Category.svg";

function Footer({ onCategoryClick, articleId }) {
  const [activeIcon, setActiveIcon] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Vérifier si l'article est déjà liké à chaque fois que articleId change
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!articleId) return;

      try {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        const userId = user?.id;

        if (!userId) return;

        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/recommendations`
        );

        const existingRecommendation = data.find(
          (recommendation) =>
            recommendation.user_id === userId &&
            recommendation.article_id === articleId
        );

        setIsLiked(!!existingRecommendation);
        setActiveIcon(existingRecommendation ? "like" : null);
      } catch (error) {
        console.error("Erreur lors de la vérification du like:", error);
      } finally {
        setLoading(false);
      }
    };

    checkIfLiked();
  }, [articleId]);

  const handleCategoryClick = () => {
    setActiveIcon(activeIcon === "category" ? null : "category");
    if (onCategoryClick) {
      onCategoryClick();
    }
  };

  const handleLikeClick = async () => {
    if (loading || !articleId) return;

    try {
      setLoading(true);
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id;

      if (!isLiked) {
        // Déboguer les données envoyées
        const dataToSend = {
          user_id: userId,
          article_id: articleId,
        };

        try {
          // Créer une recommendation (qui servira de like)
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/recommendations`,
            dataToSend
          );
          console.log("Article liké avec succès:", response.data);
          setIsLiked(true);
          setActiveIcon("like");
        } catch (err) {
          console.error("Erreur détaillée:", err.response?.data || err.message);
          throw err;
        }
      } else {
        // Trouver et supprimer la recommendation
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/recommendations`
        );

        const recommendation = data.find(
          (r) => r.user_id === userId && r.article_id === articleId
        );

        if (recommendation) {
          try {
            await axios.delete(
              `${import.meta.env.VITE_API_URL}/recommendations/${
                recommendation.id
              }`
            );
            console.log("Like retiré avec succès");
            setIsLiked(false);
            setActiveIcon(null);

            // Déclencher un événement custom pour signaler qu'un article a été unliké
            const unlikeEvent = new CustomEvent("article-unliked", {
              detail: { articleId: articleId },
            });
            window.dispatchEvent(unlikeEvent);
          } catch (err) {
            console.error(
              "Erreur lors de la suppression du like:",
              err.response?.data || err.message
            );
            throw err;
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du like:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#22333B] flex justify-between gap-5 rounded-full px-6 py-3 w-auto max-w-[80%] mx-auto">
      <button
        className="flex items-center justify-center"
        onClick={handleLikeClick}
        disabled={loading}
      >
        <img
          src={isLiked ? HoverLike : Like}
          alt="button like"
          className={`w-8 h-8 sm:w-9 sm:h-9 cursor-pointer transition-transform ${
            loading ? "opacity-50" : ""
          } ${isLiked ? "scale-110" : "scale-100"}`}
        />
      </button>
      <img
        src={activeIcon === "send" ? HoverSend : Send}
        alt="button send"
        className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer"
        onClick={() => setActiveIcon(activeIcon === "send" ? null : "send")}
      />
      <img
        src={activeIcon === "category" ? HoverCategory : Category}
        alt="button category"
        className="w-8 h-8 sm:w-9 sm:h-9 cursor-pointer"
        onClick={handleCategoryClick}
      />
    </div>
  );
}

export default Footer;
