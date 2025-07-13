import { useState } from "react";
import LOGO from "../assets/logo.jpg";
import { useSearchContext } from "../context/SearchContext";

export default function Header() {
  const { setSearchStatus, state } = useSearchContext();
  const [MobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="bg-customblue text-white">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <img
            src={LOGO}
            alt="logo"
            className="rounded-full"
            style={{ height: "60px", width: "80px" }}
          />
          <p className="font-semibold text-2xl">CivicDataSpace</p>
        </div>
        <div className="hidden md:flex items-center gap-4 mr-2">
          <i
            onClick={() => setSearchStatus(!state.searchStatus)}
            className="bi bi-search text-xl hover:text-2xl hover:cursor-pointer"
          ></i>
          <p className="hover:cursor-pointer hover:text-gray-300">ALL DATA</p>
          <p className="hover:cursor-pointer hover:text-gray-300">SECTORS</p>
          <p className="hover:cursor-pointer hover:text-gray-300">USE CASES</p>
          <p className="hover:cursor-pointer hover:text-gray-300">PUBLISHERS</p>
          <p className="hover:cursor-pointer hover:text-gray-300">ABOUT US</p>
          <button className="border-2 rounded p-2 bg-green-200 text-black font-montserrat hover:bg-green-500 hover:cursor-pointer">
            LOGIN / SIGNUP
          </button>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMobileMenu(!MobileMenu)}>
            <i className="bi bi-list text-3xl"></i>
          </button>
        </div>
      </div>
      {MobileMenu && (
        <div className="md:hidden flex flex-col items-start px-4 pb-4 gap-3 bg-customblue text-white">
          <i
            onClick={() => setSearchStatus(!state.searchStatus)}
            className="bi bi-search text-xl hover:text-2xl hover:cursor-pointer"
          ></i>
          <p className="hover:cursor-pointer hover:text-gray-300">ALL DATA</p>
          <p className="hover:cursor-pointer hover:text-gray-300">SECTORS</p>
          <p className="hover:cursor-pointer hover:text-gray-300">USE CASES</p>
          <p className="hover:cursor-pointer hover:text-gray-300">PUBLISHERS</p>
          <p className="hover:cursor-pointer hover:text-gray-300">ABOUT US</p>
          <button className="border-2 rounded p-2 bg-green-200 text-black font-montserrat hover:bg-green-500 hover:cursor-pointer">
            LOGIN / SIGNUP
          </button>
        </div>
      )}
    </header>
  );
}
