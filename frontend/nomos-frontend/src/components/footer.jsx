// filepath: /nomos-frontend/nomos-frontend/src/components/footer.jsx
import React from 'react';

const Footer = ({ onCategoryClick }) => {
  return (
    <footer className="flex justify-between items-center p-4 bg-[#22333B] text-white">
      <button onClick={onCategoryClick} className="hover:text-gray-300">
        Categories
      </button>
      <p className="text-sm">© Nomos 2025</p>
      <button className="hover:text-gray-300">
        Contact
      </button>
    </footer>
  );
};

export default Footer;