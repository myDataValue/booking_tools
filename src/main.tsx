import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { MyDataValueDashboard, MyDataValuePropertyLookup } from '@mydatavalue/sdk';
import App from "./App";
import PerformanceOptimization from "./performanceOptimization";
import PortfolioAuto from "./PortfolioAuto";
import RevisedFigure4 from "./AdrVsOcc";
import "./index.css";
import '@mydatavalue/sdk/style.css';

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
            <li>
              <Link to="/portfolio" className="hover:text-gray-300">Portfolio</Link>
            </li>
            <li>
              <Link to="/free-health-score" className="hover:text-gray-300">Free Health Score</Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/performance" element={<PerformanceOptimization />} />
          <Route path="/adr-analysis" element={<RevisedFigure4 />} />
          <Route path="/portfolio" element={<PortfolioAuto />} />
          <Route path="/free-health-score" element={<MyDataValuePropertyLookup />} />
          <Route path="/dashboard" element={<MyDataValueDashboard userId="dk" />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}