import { Routes,Route } from "react-router-dom";
import Home from "../Pages/Home";
export default function Routess() {
    return<Routes>
        <Route path="/" element={<Home />} />
    </Routes>
}