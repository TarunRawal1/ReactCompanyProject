import LOGO from "./assets/logo.jpg"
import { useState } from "react";
import Header from "./components/Header";
import Routess from "./Routes/Routess";
import Footer from "./components/Footer";
function App() {
  return (
    <div className="App">
      <Header/>
      <Routess />
      <Footer/>
    </div>
  );
}

export default App;
