import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Satellites from "@/pages/satellites";
import SatelliteDetail from "@/pages/satellite-detail";
import Debris from "@/pages/debris";
import Analytics from "@/pages/analytics";
import Forecast from "@/pages/forecast";
import RiskEngine from "@/pages/risk";
import Collisions from "@/pages/collisions";
import Admin from "@/pages/admin";
import About from "@/pages/about";
import Launches from "@/pages/launches";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/dashboard">
          <Layout><Dashboard /></Layout>
        </Route>
        <Route path="/satellites/:id">
          <Layout><SatelliteDetail /></Layout>
        </Route>
        <Route path="/satellites">
          <Layout><Satellites /></Layout>
        </Route>
        <Route path="/debris">
          <Layout><Debris /></Layout>
        </Route>
        <Route path="/analytics/forecast">
          <Layout><Forecast /></Layout>
        </Route>
        <Route path="/analytics">
          <Layout><Analytics /></Layout>
        </Route>
        <Route path="/risk">
          <Layout><RiskEngine /></Layout>
        </Route>
        <Route path="/collisions">
          <Layout><Collisions /></Layout>
        </Route>
        <Route path="/launches">
          <Layout><Launches /></Layout>
        </Route>
        <Route path="/admin">
          <Layout><Admin /></Layout>
        </Route>
        <Route path="/about">
          <Layout><About /></Layout>
        </Route>
        <Route>
          <Layout><NotFound /></Layout>
        </Route>
      </Switch>
    </>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
