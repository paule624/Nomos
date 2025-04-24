import React from "react";
import logo from "/Logo_Nom_Dark.png";
import BgLogo from "/Logo-bg-Nomos.png";
import "./NoLog.css";

const NoLog = ({ onAuthClick }) => {
  return (
    <div className="nolog-container">
      <div
        className="bg-logo"
        style={{ backgroundImage: `url(${BgLogo})` }}
      ></div>
      <div className="nolog-content">
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
          className="z-10 px-6 py-3 bg-[#D7F75B] text-[#22333B] rounded-full font-semibold text-xl hover:shadow-[0_0_7.53px_rgba(215,247,91,1)] transition-all"
        >
          C'est parti !
        </button>
      </div>
    </div>
  );
};

export default NoLog;
