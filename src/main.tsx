import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import App from "./App";
import PerformanceOptimization from "./performanceOptimization";
import RevisedFigure4 from "./AdrVsOcc";
import "./index.css";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-300">Booking Calculator</Link>
            </li>
            <li>
              <Link to="/performance" className="hover:text-gray-300">Performance Dashboard</Link>
            </li>
            <li>
              <Link to="/adr-analysis" className="hover:text-gray-300">ADR Analysis</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/performance" element={<PerformanceOptimization />} />
          <Route path="/adr-analysis" element={<RevisedFigure4 />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}