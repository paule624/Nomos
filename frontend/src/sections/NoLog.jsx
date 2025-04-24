import React from "react";
import logo from "/Logo_Nom_Dark.png";
import bgLogo from "/Logo-bg-Nomos.png";

const NoLog = ({ onAuthClick }) => {
  return (
    <div className=" w-full h-full pointer-events-none bg-[#F2F4F3]">
      <img
        src={bgLogo}
        alt="Background"
        className=" w-auto h-auto opacity-5"
        style={{
          minHeight: "100%",
          minWidth: "100%",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full py-[10%] md:py-[20%] w-full max-w-md mx-auto">
        <div className="flex flex-col items-center">
          <img src={logo} alt="Nomos" className="w-[70%] max-w-[300px]" />
          <p className="text-xl md:text-3xl mb-8 md:mb-12 text-center text-[#22333B]/80 mt-6 md:mt-10 leading-relaxed">
            Avec Nomos forges-toi
            <br /> l'esprit par la <span className="font-bold">
              neutralité
            </span>{" "}
            de
            <br /> l'information !
          </p>
        </div>

        <button
          onClick={onAuthClick}
          className="px-6 md:px-8 py-2.5 md:py-3 bg-[#D7F75B] text-[#22333B] rounded-full font-semibold text-xl md:text-2xl hover:shadow-[0_0_7.53px_rgba(215,247,91,1)] transition-all"
        >
          C'est parti !
        </button>

        <div className="flex-1"></div>
      </div>
    </div>
  );
};

export default NoLog;
