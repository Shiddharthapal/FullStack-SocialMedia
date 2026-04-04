
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import Layout from "../layouts/Layout";
import Login from "./pages/login/index";
import Home from "./pages/home/index";
import Register from "./pages/register/index";
import ProtectedRoute from "./ProtectedRoute";


export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              
            </Route>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}
