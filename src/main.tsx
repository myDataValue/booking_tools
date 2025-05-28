import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { MyDataValueHealthScore } from '@mydatavalue/sdk';
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
              <Link to="/" className="hover:text-gray-300">Free Health Score Page</Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-gray-300">Free Health Score Search</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<MyDataValueHealthScore channelListingId={11080502} />} />
          <Route path="/search" element={<MyDataValueHealthScore />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}