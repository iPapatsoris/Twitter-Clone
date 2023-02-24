import React from "react";
import ReactDOM from "react-dom/client";
import "./global.css";
import Router from "./Router";
import { AuthContext } from "./util/hooks/useAuth";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthContext.Provider
      value={
        {
          // user: { id: 1, avatar: "adsf", username: "adsf", name: "asdf" },
        }
      }
    >
      <Router />
    </AuthContext.Provider>
  </React.StrictMode>
);
