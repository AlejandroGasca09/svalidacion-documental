import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Principal from "./pages/Principal";
import VistaDocumento from "./pages/VistaDocumento";
import Login from "./pages/Login";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token');
    return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <div>
                <Header></Header>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <PrivateRoute>
                            <Principal />
                        </PrivateRoute>
                    } />
                    <Route path="/v/:id" element={<VistaDocumento />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}
export default App;