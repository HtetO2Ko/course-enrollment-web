import { Route, Routes } from "react-router";
import Layout from "./layouts/Layout";
import Home from "./pages/home/Home";
import Contact from "./pages/contact/Contact";
import BatchDetail from "./pages/batchdetail/BatchDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />}></Route>
        <Route path="contact" element={<Contact />}></Route>
        <Route path="batches/:batchId" element={<BatchDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
