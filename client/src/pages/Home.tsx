import HeroSection from "../components/HeroSection";
import LiveExchangeRates from "../components/LiveExchangeRates";
import CurrencyCalculator from "../components/CurrencyCalculator";
import DigitalBankComparison from "../components/DigitalBankComparison";
import NewsSection from "../components/NewsSection";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const { isError: isCurrencyError } = useQuery({
    queryKey: ["/api/currency-pairs"],
    retry: 1,
  });

  const { isError: isBanksError } = useQuery({
    queryKey: ["/api/digital-banks"],
    retry: 1,
  });

  const { isError: isNewsError } = useQuery({
    queryKey: ["/api/news"],
    retry: 1,
  });

  return (
    <>
      {(isCurrencyError || isBanksError || isNewsError) && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t("errors.fetchingData")}
          </AlertDescription>
        </Alert>
      )}
      
      <HeroSection />
      <LiveExchangeRates />
      <CurrencyCalculator />
      <DigitalBankComparison />
      <NewsSection />
    </>
  );
};

export default Home;
