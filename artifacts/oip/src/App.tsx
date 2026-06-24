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

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/:rest*">
        <Layout>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/satellites" component={Satellites} />
            <Route path="/satellites/:id" component={SatelliteDetail} />
            <Route path="/debris" component={Debris} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/analytics/forecast" component={Forecast} />
            <Route path="/risk" component={RiskEngine} />
            <Route path="/collisions" component={Collisions} />
            <Route path="/admin" component={Admin} />
            <Route path="/about" component={About} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
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