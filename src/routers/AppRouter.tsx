import { Routes, Route } from "react-router-dom";
import Principal from "../pages/Principal";
import VistaDocumento from "../pages/VistaDocumento";

export default function AppRouter() {
    return (
        <Routes>
            {/* Ruta principal donde se genera el QR */}
            <Route path="/" element={<Principal />} />
            
            {/* Ruta a la que te lleva el QR al escanearlo (la vista del archivo) */}
            <Route path="/v/:token" element={<VistaDocumento />} />
        </Routes>
    );
}