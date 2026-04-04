
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import Layout from "../layouts/Layout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./pages/login/index";
import Home from "./pages/home/index";
// import Register from "./pages/register/index";


export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              {/* <Route path="/createaccount" element={<Register />} /> */}
              {/* <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              /> */}
              
            </Route>
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}
