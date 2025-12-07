import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    "Customers",
    "Sales",
    "Profile",
  ];

  return (
    <>
      <nav className="relative container mx-auto p-6">
        <div className="flex flex-items-center justify-between">
          <img src="#" alt="Logo" className="w-16" />

          {/* Desktop menu */}
          <div className="md:flex space-x-6">
            {links.map((link) => (
              <a key={link} href="#" className="hover:text-darkGreyishBlue">
                {link}
              </a>
            ))}
          </div>

          <a
            href="#"
            className="md:block p-3 px-6 pt-2 text-white bg-brightRed rounded-full baseline hover:bg-brightRedLight"
          >Get Started</a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="block md:hidden"
          >
            <span className="block w-6 h-0.5 bg-black mb-1"></span>
            <span className="block w-6 h-0.5 bg-black mb-1"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden flex-col space-y-4 py-6 bg-white absolute left-0 right-0 top-full drop-shadow-md ${
            menuOpen ? "flex" : "hidden"
          }`}
        >
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="hover:text-darkGreyishBlue text-lg font-semibold"
            >
              {link}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
