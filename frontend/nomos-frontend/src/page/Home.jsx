import React, { useState } from "react";
import Actualites from "../sections/Actualites";
import PourToi from "../sections/Pour_toi";
import profil from "../assets/profil/profil.png";
import Footer from "../components/footer";
import Logo_nom from "/Logo_Nom.png";
import Categories from "./categories";

const Home = () => {
  const [activeTab, setActiveTab] = useState("actualites");

  return (
    <div className="home flex h-screen bg-[#22333B]">
      <div className="navbar border-r border-white/25 w-[calc(100vw/6)] flex flex-col">
        <img src={Logo_nom} alt="" className="p-6" />
        <div className="px-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full py-2 pl-10 pr-4 rounded-full bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <nav className="flex flex-col space-y-4 px-4 mt-6 flex-grow">
          <button
            onClick={() => setActiveTab("actualites")}
            className={`flex items-center space-x-3 py-2 px-4 rounded-lg transition-colors ${
              activeTab === "actualites"
                ? "bg-white/20 text-white"
                : "text-white/70 hover:bg-white/10"
            }`}
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
                strokeWidth="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <span>Actualités</span>
          </button>

          <button
            onClick={() => setActiveTab("pourtoi")}
            className={`flex items-center space-x-3 py-2 px-4 rounded-lg transition-colors ${
              activeTab === "pourtoi"
                ? "bg-white/20 text-white"
                : "text-white/70 hover:bg-white/10"
            }`}
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
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>Pour toi</span>
          </button>

          <button className="flex items-center space-x-3 py-2 px-4 rounded-lg text-white/70 hover:bg-white/10 transition-colors">
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
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Profil</span>
          </button>
        </nav>

        <div className="mt-auto px-4 pb-6 text-white/50 text-sm">
          <p>© Nomos 2025</p>
        </div>
      </div>
      <div className="flex justify-center items-center w-[calc(5*100vw/6)]">
        <div
          className="relative w-full min-w-3xs max-w-xl mx-auto overflow-hidden bg-amber-300 my-2 rounded-3xl border-4 border-gray-500"
          style={{
            height: "calc(100vh - 1rem)",
            maxHeight: "calc(100vw * 16/9)",
            maxWidth: "calc(100vh * 9/16)",
          }}
        >
          <div className="flex justify-between items-center px-6 pt-10 text-2xl text-[#22333B] relative">
            <div className="w-8"></div>

            <div className="flex gap-8 absolute left-1/2 transform -translate-x-1/2">
              <button
                onClick={() => setActiveTab("actualites")}
                className={`font-[Bold_Dispo] relative ${
                  activeTab === "actualites"
                    ? "text-[#22333B]"
                    : "text-[#22333B]/70"
                }`}
              >
                Actualités
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#22333B] transform transition-all duration-300 ease-in-out ${
                    activeTab === "actualites" ? "scale-x-100" : "scale-x-0"
                  }`}
                ></span>
              </button>
              <button
                onClick={() => setActiveTab("pourtoi")}
                className={`relative ${
                  activeTab === "pourtoi"
                    ? "text-[#22333B]"
                    : "text-[#22333B]/70"
                }`}
              >
                Pour toi
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#22333B] transform transition-all duration-300 ease-in-out ${
                    activeTab === "pourtoi" ? "scale-x-100" : "scale-x-0"
                  }`}
                ></span>
              </button>
            </div>

            <img src={profil} alt="pdp" className="w-15 h-15" />
          </div>
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100% - 150px)" }}
          >
            {activeTab === "actualites" ? (
              <Actualites />
            ) : activeTab === "pourtoi" ? (
              <PourToi />
            ) : activeTab === "categories" ? (
              <Categories />
            ) : null}
          </div>
          <div className="absolute bottom-12 w-full flex">
            <Footer onCategoryClick={() => setActiveTab("categories")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;