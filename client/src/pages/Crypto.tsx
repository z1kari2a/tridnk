import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CurrencyPair } from "@shared/schema";
import { 
  ArrowDownIcon, ArrowUpIcon, TrendingDownIcon, TrendingUpIcon, 
  Info, AlertTriangle, DollarSign, LineChart
} from "lucide-react";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { getPercentChangeClass, formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const CryptoPage = () => {
  const { t } = useTranslation();
  
  // استعلام لجلب أزواج العملات الرقمية
  const { data: initialPairs = [], isLoading } = useQuery<CurrencyPair[]>({
    queryKey: ["/api/currency-pairs"],
  });
  
  // استخدام WebSocket للحصول على تحديثات مباشرة
  const currencyPairs = useRealTimeUpdates<CurrencyPair[]>("currencyUpdate") || initialPairs;
  
  // تصفية أزواج العملات الرقمية فقط
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
  
  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">{t("crypto.pageTitle")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="h-64">
              <CardHeader>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-24 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
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
      <h1 className="text-3xl font-bold mb-4 text-center">{t("crypto.pageTitle")}</h1>
      <p className="text-center text-muted-foreground mb-8">متابعة أسعار العملات الرقمية لحظياً وتحليلات السوق</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              القيمة السوقية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">2.14 تريليون دولار</p>
            <p className="text-sm mt-2 flex items-center gap-1">
              <TrendingUpIcon className="h-4 w-4" />
              +2.5% خلال 24 ساعة
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-success text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              حجم التداول
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">89.7 مليار دولار</p>
            <p className="text-sm mt-2 flex items-center gap-1">
              <TrendingUpIcon className="h-4 w-4" />
              +5.2% خلال 24 ساعة
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-warning text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Info className="h-5 w-5" />
              مؤشر الخوف والجشع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">72 / 100</p>
            <p className="text-sm mt-2">جشع متزايد</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="prices" className="w-full mb-8">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="prices" className="w-1/2">أسعار العملات الرقمية</TabsTrigger>
          <TabsTrigger value="analysis" className="w-1/2">تحليلات وتوقعات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prices">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cryptoPairs.map(pair => (
              <Card key={pair.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{pair.name}</CardTitle>
                      <CardDescription>
                        {pair.baseCurrency}/{pair.quoteCurrency}
                      </CardDescription>
                    </div>
                    <div className={`text-right ${getPercentChangeClass(parseFloat(pair.changePercent))}`}>
                      <div className="text-2xl font-bold">
                        {formatCurrency(parseFloat(pair.rate), pair.quoteCurrency)}
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        {parseFloat(pair.changePercent).toFixed(2)}%
                        {getChangeIcon(pair.changePercent)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">أعلى سعر (24 ساعة)</p>
                      <p className="font-semibold">
                        {formatCurrency(parseFloat(pair.high24h), pair.quoteCurrency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">أدنى سعر (24 ساعة)</p>
                      <p className="font-semibold">
                        {formatCurrency(parseFloat(pair.low24h), pair.quoteCurrency)}
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">تفاصيل العملة</Button>
                    <p className="text-sm text-muted-foreground">
                      آخر تحديث: {new Date(pair.updatedAt).toLocaleTimeString("ar-EG")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analysis">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>توقعات سوق العملات الرقمية</CardTitle>
                <CardDescription>تحليل فني واتجاهات السوق المتوقعة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5 text-primary" />
                      بيتكوين (BTC)
                    </h3>
                    <p className="text-sm mb-2">
                      يشهد البيتكوين حالياً تذبذباً في منطقة المقاومة قرب 68,000 دولار. تشير المؤشرات الفنية إلى احتمالية اختراق هذا المستوى في الأيام القادمة مع زيادة حجم التداول.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-success font-semibold">مستوى الدعم:</span>
                      <span>64,500 دولار</span>
                      <span className="text-danger font-semibold mr-4">مستوى المقاومة:</span>
                      <span>69,800 دولار</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5 text-primary" />
                      إيثريوم (ETH)
                    </h3>
                    <p className="text-sm mb-2">
                      يتداول الإيثريوم في نمط تصاعدي متوسط المدى، مع دعم قوي عند مستوى 3,200 دولار. التحديث المرتقب للشبكة قد يدفع السعر للارتفاع نحو 4,000 دولار خلال الشهر القادم.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-success font-semibold">مستوى الدعم:</span>
                      <span>3,200 دولار</span>
                      <span className="text-danger font-semibold mr-4">مستوى المقاومة:</span>
                      <span>3,800 دولار</span>
                    </div>
                  </div>
                  
                  <div className="border border-warning p-4 rounded-lg flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">تنبيه للمستثمرين</h3>
                      <p className="text-sm">
                        الاستثمار في العملات الرقمية ينطوي على مخاطر عالية، وقد تتعرض الأسعار لتقلبات حادة. يُنصح بعدم استثمار أكثر مما يمكنك تحمل خسارته، والقيام بأبحاثك الخاصة قبل اتخاذ أي قرار استثماري.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>العوامل المؤثرة على السوق</CardTitle>
                <CardDescription>أهم الأحداث والتطورات المؤثرة على أسعار العملات الرقمية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-r-4 border-primary pr-4">
                    <h3 className="font-semibold">السياسات التنظيمية</h3>
                    <p className="text-sm text-muted-foreground">
                      التطورات التنظيمية في الولايات المتحدة وأوروبا تشير إلى مزيد من الوضوح القانوني للعملات الرقمية، مما قد يدعم المزيد من الاعتماد المؤسسي.
                    </p>
                  </div>
                  
                  <div className="border-r-4 border-primary pr-4">
                    <h3 className="font-semibold">اعتماد المؤسسات</h3>
                    <p className="text-sm text-muted-foreground">
                      تستمر الشركات الكبرى في تبني العملات الرقمية وتقنية البلوكتشين، مع إعلانات جديدة متوقعة خلال الربع القادم من شركات تكنولوجية كبرى.
                    </p>
                  </div>
                  
                  <div className="border-r-4 border-primary pr-4">
                    <h3 className="font-semibold">الابتكارات التقنية</h3>
                    <p className="text-sm text-muted-foreground">
                      تطورات مهمة في مجال التمويل اللامركزي (DeFi) وتقنيات الطبقة الثانية تعزز من قدرة منظومة العملات الرقمية على التوسع وتحسين الأداء.
                    </p>
                  </div>
                  
                  <div className="border-r-4 border-warning pr-4">
                    <h3 className="font-semibold">عوامل الخطر</h3>
                    <p className="text-sm text-muted-foreground">
                      التضخم العالمي وسياسات البنوك المركزية قد تؤثر على اتجاهات السيولة في الأسواق، مما قد يخلق تقلبات في سوق العملات الرقمية على المدى القصير.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>تعلم أساسيات العملات الرقمية</CardTitle>
          <CardDescription>مقالات ومصادر للمبتدئين والمتقدمين</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold mb-2">ما هي البلوكتشين؟</h3>
              <p className="text-sm text-muted-foreground mb-3">
                دليل شامل لفهم تقنية البلوكتشين وكيفية عملها وتطبيقاتها.
              </p>
              <Button variant="outline" size="sm">قراءة المقال</Button>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold mb-2">تخزين العملات الرقمية بأمان</h3>
              <p className="text-sm text-muted-foreground mb-3">
                دليل لأفضل الممارسات في تأمين وتخزين العملات الرقمية وأنواع المحافظ.
              </p>
              <Button variant="outline" size="sm">قراءة المقال</Button>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold mb-2">التحليل الفني للعملات الرقمية</h3>
              <p className="text-sm text-muted-foreground mb-3">
                مقدمة في أساسيات التحليل الفني وكيفية تطبيقه على سوق العملات الرقمية.
              </p>
              <Button variant="outline" size="sm">قراءة المقال</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoPage;