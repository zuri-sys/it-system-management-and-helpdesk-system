import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import RouteFocus from "./components/RouteFocus";
import LoginPage from "./pages/LoginPage";
import TicketListPage from "./pages/TicketListPage";
import TicketFormPage from "./pages/TicketFormPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteFocus />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/tickets" element={<TicketListPage />} />
              <Route
                path="/tickets/new"
                element={<TicketFormPage key="create" />}
              />
              <Route path="/tickets/:id" element={<TicketDetailsPage />} />
              <Route
                path="/tickets/:id/edit"
                element={<TicketFormPage key="edit" />}
              />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/tickets" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
