import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { MyDataValueDashboard, MyDataValueHealthScore } from '@mydatavalue/sdk';
import "./index.css";
import '@mydatavalue/sdk/style.css';

const root = document.getElementById("root");

const appProps = {
  accountId: 21363484, // users booking account id
  userDetails: {
    email: 'test@hostify.com',
    firstName: 'John',
    lastName: 'Doe',
  },
  properties: [
    {
      property_id: 11397434, // channel_listing_id
      name: 'Adeti Residence',
      markup: 55,
    }
  ],
};

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BrowserRouter>
        <nav className="bg-gray-800 text-white p-4 w-full">
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
          <Route path="/" element={<MyDataValueDashboard {...appProps} />} />
          <Route path="/search" element={<MyDataValueHealthScore />} />
          <Route path="/searched-property" element={<MyDataValueHealthScore channelListingId={8740347} />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}