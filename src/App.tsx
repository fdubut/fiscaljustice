import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Introduction from "./pages/Introduction";
import Simulator from "./pages/Simulator";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Introduction />} />
          <Route path="simulator" element={<Simulator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
