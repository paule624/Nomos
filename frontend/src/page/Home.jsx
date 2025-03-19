import React, { useState, useRef } from "react";
import Actualites from "../sections/Actualites";
import PourToi from "../sections/Pour_toi";
import NoLog from "../sections/NoLog";
import AuthPage from "../sections/AuthPage";
import { isAuthenticated } from "../utils/auth";
import profil from "../assets/profil/profil.png";
import Footer from "../components/footer";
import Logo_nom from "/Logo_Nom.png";
import Categories from "./Categories";
import Profil from "../sections/Profil";
import DetailCategories from "../sections/Detail_Categories";

const Home = () => {
  const [activeTab, setActiveTab] = useState(
    isAuthenticated() ? "actualites" : "no-log"
  );
  const contentRef = useRef(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleScroll = (direction) => {
    if (contentRef.current) {
      const scrollAmount = 800;
      const targetScroll =
        contentRef.current.scrollTop +
        (direction === "up" ? -scrollAmount : scrollAmount);
      contentRef.current.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="home flex h-screen bg-[#22333B]">
      {/* La navbar est toujours affichée mais avec un contenu différent */}
      <div className="navbar border-r border-white/25 w-[calc(100vw/6)] flex flex-col">
        <img src={Logo_nom} alt="" className="p-6" />

        <nav className="flex flex-col space-y-4 px-4 mt-6 flex-grow">
          {isAuthenticated() ? (
            <>
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
              <button
                onClick={() => setActiveTab("profil")}
                className={`flex items-center space-x-3 py-2 px-4 rounded-lg transition-colors ${
                  activeTab === "profil"
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>Profil</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab("auth")}
                className={`flex items-center space-x-3 py-2 px-4 rounded-lg transition-colors ${
                  activeTab === "auth"
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span>Connexion</span>
              </button>
            </>
          )}
        </nav>

        <div className="mt-auto px-4 pb-6 text-white/50 text-sm">
          <p>© Nomos 2025</p>
        </div>
      </div>

      <div
        className={`flex justify-center items-center ${
          isAuthenticated() ? "w-[calc(5*100vw/6)]" : "w-full"
        }`}
      >
        {/* Container avec taille maximale */}
        <div className="relative mx-auto w-full max-w-[500px] h-[90vh] min-h-[600px] max-h-[1000px]">
          {/* Mockup du téléphone avec ratio préservé */}
          <div className="relative w-full h-full bg-[#] rounded-[clamp(30px,5vw,60px)] shadow-xl overflow-hidden border-[clamp(8px,1.5vw,14px)] border-[#22333B]">
            {/* Encoche du téléphone */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[40%] h-[clamp(20px,3vh,28px)] bg-[#22333B] rounded-b-3xl z-20"></div>

            {/* Contenu de l'application avec padding adaptatif */}
            <div className="relative h-full w-full bg-[#F2F4F3] overflow-hidden">
              {/* Header conditionnel */}
              {isAuthenticated() &&
                activeTab !== "categories" &&
                activeTab !== "profil" &&
                activeTab !== "detail_categories" && (
                  <div className="flex justify-between items-center px-[clamp(16px,2vw,24px)] pt-[clamp(24px,4vh,40px)] text-[clamp(16px,2vw,24px)] text-[#22333B] relative pb-2">
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
                            activeTab === "actualites"
                              ? "scale-x-100"
                              : "scale-x-0"
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
                            activeTab === "pourtoi"
                              ? "scale-x-100"
                              : "scale-x-0"
                          }`}
                        ></span>
                      </button>
                    </div>

                    <button
                      onClick={() => setActiveTab("profil")}
                      className="cursor-pointer"
                    >
                      <img
                        src={profil}
                        alt="Profil"
                        className="w-15 h-15  transition-opacity"
                      />
                    </button>
                  </div>
                )}

              {/* Contenu principal */}
              <div
                ref={contentRef}
                className={`overflow-y-auto hide-scrollbar ${
                  activeTab === "categories" ||
                  activeTab === "profil" ||
                  activeTab === "auth" ||
                  activeTab === "detail_categories"
                    ? "h-full"
                    : "h-[calc(100%-clamp(100px,15vh,150px))]"
                }`}
              >
                {activeTab === "no-log" ? (
                  <NoLog onAuthClick={() => setActiveTab("auth")} />
                ) : activeTab === "auth" ? (
                  <AuthPage onLoginSuccess={() => setActiveTab("actualites")} />
                ) : activeTab === "actualites" ||
                  activeTab === "pourtoi" ||
                  activeTab === "detail_categories" ? (
                  <>
                    {activeTab === "actualites" ? (
                      <Actualites />
                    ) : activeTab === "pourtoi" ? (
                      <PourToi />
                    ) : (
                      <>
                        <DetailCategories
                          categoryId={selectedCategoryId}
                          onBackClick={() => setActiveTab("categories")}
                        />
                        {/* Déplacer les boutons de défilement et le footer ici */}
                        <div className="fixed right-6 bottom-24 flex flex-col gap-3 z-50">
                          <button
                            onClick={() => handleScroll("up")}
                            className="p-3 rounded-full bg-[#22333B]/80 hover:bg-white/90"
                            aria-label="Défiler vers le haut"
                          >
                            <svg
                              className="w-6 h-6 text-white hover:text-[#22333B]"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleScroll("down")}
                            className="p-3 rounded-full bg-[#22333B]/80 hover:bg-white/90"
                            aria-label="Défiler vers le bas"
                          >
                            <svg
                              className="w-6 h-6 text-white hover:text-[#22333B]"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="absolute bottom-[clamp(24px,4vh,48px)] w-full flex">
                          <Footer
                            onCategoryClick={() => setActiveTab("categories")}
                          />
                        </div>
                      </>
                    )}
                  </>
                ) : activeTab === "categories" ? (
                  <Categories
                    setActiveTab={setActiveTab}
                    setSelectedCategoryId={setSelectedCategoryId} // Ajout de cette prop
                  />
                ) : activeTab === "profil" ? (
                  <Profil setActiveTab={setActiveTab} />
                ) : null}
              </div>

              {/* Footer ne s'affiche que si authentifié et pas sur certaines pages */}
              {isAuthenticated() &&
                activeTab !== "categories" &&
                activeTab !== "profil" &&
                activeTab !== "auth" &&
                activeTab !== "detail_categories" && (
                  <div className="absolute bottom-[clamp(24px,4vh,48px)] w-full flex">
                    <Footer
                      onCategoryClick={() => setActiveTab("categories")}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
