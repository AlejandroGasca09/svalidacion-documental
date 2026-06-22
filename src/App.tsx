import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Principal from "./pages/Principal";
import VistaDocumento from "./pages/VistaDocumento";

function App() {
    return (
        <BrowserRouter>
            <div>
                <Header></Header>
                <Routes>
                    <Route path="/" element={<Principal />} />
                    <Route path="/v/:id" element={<VistaDocumento />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}
export default App;