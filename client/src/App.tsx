import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import AdminPanel from "./pages/Admin";
import Login from "./pages/Login";
import NewsPage from "./pages/News";
import CurrencyRatesPage from "./pages/CurrencyRates";
import DigitalBanksPage from "./pages/DigitalBanks";
import ForumPage from "./pages/Forum";
import AboutPage from "./pages/About";
import CryptoPage from "./pages/Crypto";
import AuthGuard from "./components/AuthGuard";
import { NotificationProvider } from "./context/NotificationContext";
import Layout from "./components/Layout";
import { ThemeProvider } from "./components/ui/theme-provider";
import "./lib/i18n"; // Initialize i18next

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/admin">
        <AuthGuard>
          <AdminPanel />
        </AuthGuard>
      </Route>
      <Route path="/news" component={NewsPage} />
      <Route path="/currency-rates" component={CurrencyRatesPage} />
      <Route path="/digital-banks" component={DigitalBanksPage} />
      <Route path="/forum" component={ForumPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/crypto" component={CryptoPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <NotificationProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
