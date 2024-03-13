
import "./App.css";
import Admin_signup from "./pages/Admin_signup";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/Admin_page";
import SupervisorPage from "./pages/SupervisorPage";
import ProductManagement from "./pages/ProductManagement";
import SupervisorManagement from "./pages/SupervisorManagement";
import SupervisorProducts from "./pages/SupervisorProductsPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Admin_signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/adminPage" element={<AdminPage />} />
          <Route path="/supervisors" element={<SupervisorManagement />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/supervisorPage" element={<SupervisorPage />} />
          <Route path="/SupervisorProducts" element={<SupervisorProducts />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
