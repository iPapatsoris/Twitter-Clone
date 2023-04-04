import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import Auth from "./Auth";
import "./global.css";
import Router from "./Router";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Auth>
        <Router />
      </Auth>
    </QueryClientProvider>
  </React.StrictMode>
);
