import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { ChartLine, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { useState, useEffect } from "react";
import { CurrencyPair } from "@shared/schema";

const LiveExchangeRates = () => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(5);
  const [currencyPairs, setCurrencyPairs] = useState<CurrencyPair[]>([]);
  
  const { data, isLoading, isError, refetch } = useQuery<CurrencyPair[]>({
    queryKey: ["/api/currency-pairs"],
  });
  
  // Initialize currency pairs from API data
  useEffect(() => {
    if (data) {
      setCurrencyPairs(data);
    }
  }, [data]);
  
  // Auto-refresh data every 5 seconds
  useEffect(() => {
    if (countdown <= 0) {
      refetch();
      setCountdown(5);
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, refetch]);

  const renderCurrencyPair = (pair: CurrencyPair) => {
    const isPositive = !pair.changePercent.startsWith("-");
    
    return (
      <Card 
        key={pair.id}
        className={`bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 border-r-4 ${
          pair.type === "fiat" ? "border-primary-600" : "border-warning-500"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="text-xl font-bold">{pair.name}</span>
          </div>
          <span 
            className={`${
              isPositive ? "text-green-500" : "text-red-500"
            } text-sm flex items-center`}
          >
            {isPositive ? (
              <ArrowUp className="ml-1 h-3 w-3" />
            ) : (
              <ArrowDown className="ml-1 h-3 w-3" />
            )}
            {Math.abs(parseFloat(pair.changePercent))}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">{pair.rate}</span>
          <div className="bg-gray-100 rounded-full px-2 py-1 text-xs">
            <span className="font-medium">24h:</span>
            <span className={isPositive ? "text-green-500" : "text-red-500"}>
              {isPositive ? "+" : ""}
              {pair.change24h}
            </span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-sm text-gray-500">
            <span>{t("currencyRate.open")}: {pair.open24h}</span>
            <span>{t("currencyRate.high")}: {pair.high24h}</span>
          </div>
        </div>
      </Card>
    );
  };

  const renderSkeleton = () => (
    <Card className="bg-white rounded-lg shadow-sm p-4 border-r-4 border-gray-300">
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </Card>
  );

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          <ChartLine className="text-primary-600 mr-2 inline-block h-5 w-5" />
          {t("currencyRate.title")}
        </h2>
        <div className="text-sm text-gray-500 flex items-center">
          <span>{t("currencyRate.autoUpdate")}:</span>
          <span className="mx-2 font-medium">{countdown}</span>
          <span>{t("currencyRate.seconds")}</span>
          <RefreshCw className={`text-primary-600 mr-2 h-4 w-4 ${countdown === 0 ? "" : "animate-spin"}`} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {renderSkeleton()}
            {renderSkeleton()}
            {renderSkeleton()}
            {renderSkeleton()}
          </>
        ) : isError ? (
          <div className="col-span-full text-center p-4 bg-red-50 text-red-500 rounded-lg">
            {t("errors.fetchingRates")}
          </div>
        ) : (
          currencyPairs.map(renderCurrencyPair)
        )}
      </div>
    </section>
  );
};

export default LiveExchangeRates;
