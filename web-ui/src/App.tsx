import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./features/home/Home";
import Layout from "./features/layout/Layout";
import Providers from "./features/providers/Providers";
import MasterAgreement from "./features/master-agreements/MasterAgreement";
import NoMatch from "./components/no-match/NoMatch";
import Offers from "./features/offers/Offers";
import Login from "./features/login/Login";
import { AuthProvider } from "./app-providers/AuthProvider";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthProvider>
            <Layout />
          </AuthProvider>
        }
      >
        <Route
          index
          element={<Home />}
        />
        <Route
          path="providers"
          element={<Providers />}
        />
        <Route
          path="masteragreements"
          element={<MasterAgreement />}
        />
        <Route
          path="offers"
          element={<Offers />}
        />
      </Route>
      <Route path="*" element={<NoMatch />} />
      <Route path="login" element={<Login />} />
    </Routes>
  );
}

export default App;
