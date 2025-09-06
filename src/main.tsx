import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { MyDataValueDashboard, MyDataValueHealthScore } from "@mydatavalue/sdk";
import "./index.css";
import "@mydatavalue/sdk/style.css";
import { useAuthExample } from "./auth-examples/useAuthExample";

const accountId = 10330015

function App() {
  // DO NOT DO USE THIS HOOK IN YOUR FRONTEND OR IT WILL LEAK THE SECRET. This is an example.
  // Use the auth-examples/api.ts as an example for how to auth from your server to our server
  const { token, ready, error } = useAuthExample({
    accountId,
  });

  const appProps = useMemo(() => ({
    jwtToken: String(token),
    accountId,
    markups: { 14881997: 55 },
    initialPropertiesForSetup: [
      {
        id: 16471,
        property_id: 30058984,
        name: "90sqm 3Room Full Kitchen, 5min Main Station, Quiet",
      },
    ],

  }), [token, accountId])

  if (error) return <div className="p-4 text-red-600">Auth error: {error}</div>;
  if (!ready && !token) return <div className="p-4">Bootstrapping…</div>;

  return (
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
  );
}

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
