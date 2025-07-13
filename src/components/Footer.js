import LOGO from "../assets/logo.jpg";
export default function Footer() {
  return (
    <footer className="flex justify-between items-center p-4 bg-customblue text-white">
      <div>
        <div className="flex justify-center ml-4 items-center gap-2">
          <img
            src={LOGO}
            alt="logo"
            className="logo rounded-full"
            style={{ height: "60px", width: "80px" }}
          />
          <p className="font-semibold text-2xl">CivicDataSpace</p>
        </div>
        <div className="flex justify-center gap-4 ml-6 mt-8 text-sm font-semibold items-center">
          <p className="hover:text-gray-400 hover:cursor-pointer">ABOUT US</p>
          <p className="hover:text-gray-400 hover:cursor-pointer">SITEMAP</p>
          <p className="hover:text-gray-400 hover:cursor-pointer">CONTACT US</p>
        </div>
      </div>
      <div>
        <p className="text-yellow-300 hover:cursor-pointer hover:text-yellow-500 flex justify-end mr-3 font-bold mb-1">
          FOLLOW US
        </p>
        <div className="flex justify-center gap-4 mr-2 items-center">
          <i className="bi bi-twitter text-xl rounded-full hover:cursor-pointer hover:bg-green-700 border border-green-300 bg-green-300 p-2 text-black"></i>
          <i className="bi bi-linkedin text-xl rounded-full hover:cursor-pointer hover:bg-green-700 border border-green-300 bg-green-300 p-2 text-black"></i>
          <i className="bi bi-facebook text-xl rounded-full hover:cursor-pointer hover:bg-green-700 border border-green-300 bg-green-300 p-2 text-black"></i>
          <i className="bi bi-github text-xl rounded-full hover:cursor-pointer hover:bg-green-700 border border-green-300 bg-green-300 p-2 text-black"></i>
        </div>
      </div>
    </footer>
  );
}
