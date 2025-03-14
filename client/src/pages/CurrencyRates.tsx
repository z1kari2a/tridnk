import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownIcon, ArrowUpIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { CurrencyPair } from "@shared/schema";
import { getPercentChangeClass, formatCurrency } from "@/lib/utils";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";

const CurrencyRatesPage = () => {
  const { t } = useTranslation();
  
  // استعلام لجلب جميع أزواج العملات
  const { data: initialPairs = [], isLoading } = useQuery<CurrencyPair[]>({
    queryKey: ["/api/currency-pairs"],
  });
  
  // استخدام WebSocket للحصول على تحديثات مباشرة
  const currencyPairs = useRealTimeUpdates<CurrencyPair[]>("currencyUpdate") || initialPairs;
  
  // تجميع العملات حسب النوع
  const traditionalPairs = currencyPairs.filter(pair => pair.type === "traditional");
  const cryptoPairs = currencyPairs.filter(pair => pair.type === "crypto");
  
  // تحديد لون وأيقونة حسب نسبة التغيير
  const getChangeIcon = (changePercent: string) => {
    const change = parseFloat(changePercent);
    if (change > 1) return <TrendingUpIcon className="h-5 w-5 text-success" />;
    if (change > 0) return <ArrowUpIcon className="h-5 w-5 text-success" />;
    if (change < -1) return <TrendingDownIcon className="h-5 w-5 text-danger" />;
    if (change < 0) return <ArrowDownIcon className="h-5 w-5 text-danger" />;
    return null;
  };
  
  // دالة لعرض كارت معلومات زوج العملات
  const renderCurrencyPair = (pair: CurrencyPair) => {
    const changeClass = getPercentChangeClass(parseFloat(pair.changePercent));
    
    return (
      <Card key={pair.id} className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>{pair.name}</span>
            <span className={`flex items-center gap-1 text-sm ${changeClass}`}>
              {parseFloat(pair.changePercent).toFixed(2)}%
              {getChangeIcon(pair.changePercent)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">السعر الحالي</p>
              <p className="text-xl font-bold">{formatCurrency(parseFloat(pair.rate), pair.quoteCurrency)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">التغير</p>
              <p className="text-xl font-bold">{formatCurrency(parseFloat(pair.change24h), pair.quoteCurrency)}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">آخر تحديث</p>
            <p className="text-sm">
              {new Date(pair.updatedAt).toLocaleTimeString("ar-EG")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">{t("currencyRates.pageTitle")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("currencyRates.pageTitle")}</h1>
      
      <Tabs defaultValue="traditional" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="traditional" className="w-1/2">عملات تقليدية</TabsTrigger>
          <TabsTrigger value="crypto" className="w-1/2">عملات رقمية</TabsTrigger>
        </TabsList>
        
        <TabsContent value="traditional">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {traditionalPairs.map(renderCurrencyPair)}
          </div>
        </TabsContent>
        
        <TabsContent value="crypto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cryptoPairs.map(renderCurrencyPair)}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 bg-muted p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">ملاحظات مهمة</h2>
        <p className="text-sm text-muted-foreground">
          • الأسعار يتم تحديثها بشكل مباشر لحظياً.
          <br />
          • جميع الأسعار هي أسعار إشارية وقد تختلف قليلاً عن الأسعار الفعلية للتداول.
          <br />
          • نسب التغيير محسوبة خلال 24 ساعة الماضية.
        </p>
      </div>
    </div>
  );
};

export default CurrencyRatesPage;