import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import "./global.css";
import Router from "./Router";
import { AuthContext } from "./util/hooks/useAuth";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider
        value={{
          user: { id: 1, avatar: "adsf", username: "adsf", name: "asdf" },
        }}
      >
        <Router />
      </AuthContext.Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
