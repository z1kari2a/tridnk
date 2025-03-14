import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calculator, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ExchangeRate } from "@shared/schema";

const CurrencyCalculator = () => {
  const { t } = useTranslation();
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [fromAmount, setFromAmount] = useState(100);
  const [toAmount, setToAmount] = useState(0);
  const [exchangeRateText, setExchangeRateText] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const { data: exchangeRates, isLoading, refetch } = useQuery<ExchangeRate[]>({
    queryKey: ["/api/exchange-rates"],
  });

  // Calculate exchange when inputs change
  useEffect(() => {
    if (!exchangeRates) return;
    
    const fromRate = exchangeRates.find(rate => rate.baseCurrency === fromCurrency);
    
    if (!fromRate) return;
    const rates = fromRate.rates as Record<string, number>;
    if (!rates || !rates[toCurrency]) return;
    
    // Calculate converted amount
    const rate = rates[toCurrency];
    const converted = fromAmount * rate;
    setToAmount(parseFloat(converted.toFixed(4)));
    
    // Update rate text
    setExchangeRateText(`1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`);
    
    // Update last updated time
    setLastUpdated(new Date());
  }, [fromCurrency, toCurrency, fromAmount, exchangeRates]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFromAmount(isNaN(value) ? 0 : value);
  };

  const handleFromCurrencyChange = (value: string) => {
    if (value === toCurrency) {
      setToCurrency(fromCurrency);
    }
    setFromCurrency(value);
  };

  const handleToCurrencyChange = (value: string) => {
    if (value === fromCurrency) {
      setFromCurrency(toCurrency);
    }
    setToCurrency(value);
  };

  const refreshRates = () => {
    refetch();
  };

  const getTimeSinceUpdate = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return t("calculator.secondsAgo", { count: diffInSeconds });
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return t("calculator.minutesAgo", { count: diffInMinutes });
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    return t("calculator.hoursAgo", { count: diffInHours });
  };

  const currencyOptions = [
    { value: "USD", label: t("currencies.usd") },
    { value: "EUR", label: t("currencies.eur") },
    { value: "GBP", label: t("currencies.gbp") },
    { value: "JPY", label: t("currencies.jpy") },
    { value: "BTC", label: t("currencies.btc") }
  ];

  return (
    <section className="mb-8">
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary-800 text-white p-4">
          <h2 className="text-xl font-bold flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            {t("calculator.title")}
          </h2>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("calculator.amount")}
              </label>
              <div className="flex">
                <Input
                  type="number"
                  value={fromAmount}
                  onChange={handleFromAmountChange}
                  className="rounded-r-lg w-full py-2 px-3 text-gray-700"
                />
                <Select value={fromCurrency} onValueChange={handleFromCurrencyChange}>
                  <SelectTrigger className="w-[200px] rounded-l-lg rounded-r-none border-r-0">
                    <SelectValue placeholder={t("calculator.selectCurrency")} />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {t("calculator.equivalent")}
              </label>
              <div className="flex">
                <Input
                  type="number"
                  value={toAmount}
                  readOnly
                  className="bg-gray-50 rounded-r-lg w-full py-2 px-3 text-gray-700"
                />
                <Select value={toCurrency} onValueChange={handleToCurrencyChange}>
                  <SelectTrigger className="w-[200px] rounded-l-lg rounded-r-none border-r-0">
                    <SelectValue placeholder={t("calculator.selectCurrency")} />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <div className="text-sm text-gray-600">
              <span>{t("calculator.exchangeRate")}: </span>
              <span className="font-semibold">
                {isLoading ? t("common.loading") : exchangeRateText}
              </span>
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <span>{t("calculator.lastUpdated")}: </span>
              <span className="font-semibold mr-2">{getTimeSinceUpdate()}</span>
              <button
                className="text-primary-600 hover:text-primary-700"
                onClick={refreshRates}
                aria-label={t("calculator.refresh")}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CurrencyCalculator;
