import { Routes, Route } from "react-router";
import Layout from "./layouts/Layout";
import Home from "./pages/home/Home";
import Contact from "./pages/contact/Contact";
import AuthPage from "./pages/auth/AuthPage";
import BatchDetail from "./pages/batches/BatchDetail";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/batches/:batchId" element={<BatchDetail />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Route>
    </Routes>
  );
}
