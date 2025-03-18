import React, { useState } from "react";
import Like from "../assets/Footer/Like.svg";
import Send from "../assets/Footer/Send.svg";
import Category from "../assets/Footer/Category.svg";
import HoverLike from "../assets/Footer/hover_Like.svg";
import HoverSend from "../assets/Footer/hover_Send.svg";
import HoverCategory from "../assets/Footer/hover_Category.svg";

function Footer({ onCategoryClick }) {
  const [activeIcon, setActiveIcon] = useState(null);

  const handleCategoryClick = () => {
    console.log("Category button clicked");
    setActiveIcon(activeIcon === "category" ? null : "category");
    if (onCategoryClick) {
      console.log("Calling onCategoryClick");
      onCategoryClick();
    } else {
      console.log("onCategoryClick is not defined");
    }
  };

  return (
    <div className="bg-[#22333B] flex justify-between gap-5 rounded-full px-6 py-3 w-auto max-w-[80%] mx-auto">
      <img
        src={activeIcon === "like" ? HoverLike : Like}
        alt="button like"
        className="w-[calc(8vmin)] h-[calc(8vmin)] max-w-9 max-h-9 cursor-pointer"
        onClick={() => setActiveIcon(activeIcon === "like" ? null : "like")}
      />
      <img
        src={activeIcon === "send" ? HoverSend : Send}
        alt="button send"
        className="w-[calc(8vmin)] h-[calc(8vmin)] max-w-9 max-h-9 cursor-pointer"
        onClick={() => setActiveIcon(activeIcon === "send" ? null : "send")}
      />
      <img
        src={activeIcon === "category" ? HoverCategory : Category}
        alt="button category"
        className="w-[calc(8vmin)] h-[calc(8vmin)] max-w-9 max-h-9 cursor-pointer"
        onClick={handleCategoryClick}
      />
    </div>
  );
}

export default Footer;
