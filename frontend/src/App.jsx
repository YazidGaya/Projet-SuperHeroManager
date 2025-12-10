import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AddHeroPage from "./pages/AddHeroPage";
import PrivateRoute from "./components/PrivateRoute";
import EditHeroPage from "./pages/EditHeroPage.jsx";
import HeroDetailsPage from "./pages/HeroDetailsPage";
function App() {
  return (
    <Routes>

      {/* Page de connexion */}
      <Route path="/" element={<LoginPage />} />

      {/* Dashboard (protégé) */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/edit-hero/:id"
        element={
          <PrivateRoute>
            <EditHeroPage />
          </PrivateRoute>
        }
      />
      {/* Ajouter un héros (protégé) */}
      <Route
        path="/add-hero"
        element={
          <PrivateRoute>
            <AddHeroPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/hero/:id"
        element={
         <PrivateRoute>
            <HeroDetailsPage />
         </PrivateRoute>
        }
      />
    </Routes>
    
  );
}

export default App;
