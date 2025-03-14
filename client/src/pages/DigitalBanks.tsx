import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DigitalBank } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, ExternalLinkIcon, StarIcon } from "lucide-react";

const DigitalBanksPage = () => {
  const { t } = useTranslation();
  
  // استعلام لجلب البنوك الرقمية
  const { data: digitalBanks = [], isLoading } = useQuery<DigitalBank[]>({
    queryKey: ["/api/digital-banks"],
  });
  
  // تصنيف البنوك (هنا نفترض أن البنوك موزعة بالتساوي لعرض المثال)
  const splitBanks = (banks: DigitalBank[]) => {
    const third = Math.ceil(banks.length / 3);
    return {
      internationalBanks: banks.slice(0, third),
      europeBanks: banks.slice(third, third * 2),
      middleEastBanks: banks.slice(third * 2)
    };
  };
  
  const { internationalBanks, europeBanks, middleEastBanks } = splitBanks(digitalBanks);
  
  // دالة تقديم بطاقة معلومات البنك
  const renderBankCard = (bank: DigitalBank) => {
    // تحديد نوع البنك بناءً على موقعه في المصفوفة
    const getBankType = () => {
      if (internationalBanks.some(b => b.id === bank.id)) return "دولي";
      if (europeBanks.some(b => b.id === bank.id)) return "أوروبا";
      return "الشرق الأوسط";
    };
    
    // تحديد إذا كان موصى به (مثال: البنوك ذات الرسوم المنخفضة)
    const isRecommended = bank.transferFees.includes("منخفضة") || 
                          parseFloat(bank.transferFees.replace(/[^\d.]/g, '')) < 5;
    
    return (
      <Card key={bank.id} className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle>{bank.name}</CardTitle>
            <Badge variant={isRecommended ? "default" : "outline"}>
              {isRecommended ? "موصى به" : getBankType()}
            </Badge>
          </div>
          <CardDescription>
            {`بنك رقمي متخصص في ${bank.supportedCountries}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">المميزات الرئيسية:</h3>
          <ul className="space-y-2">
            {[
              `سرعة التحويل: ${bank.transferSpeed}`,
              `أسعار صرف: ${bank.exchangeRate}`,
              `خدمات في: ${bank.supportedCountries}`
            ].map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckIcon className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">رسوم التحويل</p>
              <p className="font-semibold">{bank.transferFees}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">سرعة التحويل</p>
              <p className="font-semibold">{bank.transferSpeed}</p>
            </div>
          </div>
          
          {/* أسعار العملات في البنك */}
          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">أسعار الصرف الرسمية في البنك:</p>
            <div className="bg-muted p-2 rounded-md">
              <div className="grid grid-cols-3 gap-2 text-sm">
                {bank.currencyRates && Object.entries(bank.currencyRates).slice(0, 6).map(([pair, rate]) => (
                  <div key={pair} className="flex flex-col">
                    <span className="text-xs text-muted-foreground">{pair}</span>
                    <span className="font-medium">{typeof rate === 'number' ? rate.toFixed(4) : rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* أسعار السوق السوداء */}
          {bank.blackMarketRates && Object.keys(bank.blackMarketRates).length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">أسعار السوق السوداء:</p>
              <div className="bg-destructive/10 p-2 rounded-md">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(bank.blackMarketRates).map(([pair, rate]) => (
                    <div key={pair} className="flex flex-col">
                      <span className="text-xs text-muted-foreground">{pair}</span>
                      <span className="font-medium">{typeof rate === 'number' ? rate.toFixed(2) : rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* تقييم افتراضي بناءً على سرعة التحويل */}
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">التقييم</p>
            <div className="flex items-center gap-1 mt-1">
              {Array(5).fill(0).map((_, i) => {
                const rating = bank.transferSpeed.includes("ساعة") ? 5 : 
                              bank.transferSpeed.includes("يوم") ? 4 : 3;
                return (
                  <StarIcon 
                    key={i} 
                    className={`h-4 w-4 ${i < rating ? "text-warning fill-warning" : "text-muted"}`} 
                  />
                );
              })}
              <span className="text-sm ml-2">
                {bank.transferSpeed.includes("ساعة") ? "5" : 
                bank.transferSpeed.includes("يوم") ? "4" : "3"}/5
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <a href={`/digital-banks/${bank.id}`}>
              المزيد من التفاصيل
            </a>
          </Button>
          <Button variant="default" asChild>
            <a href={bank.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              زيارة الموقع <ExternalLinkIcon className="h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">{t("digitalBanks.pageTitle")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">{t("digitalBanks.pageTitle")}</h1>
      <p className="text-center text-muted-foreground mb-8">مقارنة بين أفضل البنوك والمحافظ الرقمية للعملات التقليدية والرقمية</p>
      
      <div className="mb-8 bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">لماذا تختار البنوك الرقمية؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background p-4 rounded-lg">
            <h3 className="font-semibold mb-2">رسوم أقل</h3>
            <p className="text-sm">تكاليف تشغيل أقل من البنوك التقليدية مما يترجم إلى رسوم أقل للمستخدمين</p>
          </div>
          <div className="bg-background p-4 rounded-lg">
            <h3 className="font-semibold mb-2">تحويلات عالمية</h3>
            <p className="text-sm">تحويلات دولية بأسعار صرف تنافسية ورسوم منخفضة وسرعة وصول أعلى</p>
          </div>
          <div className="bg-background p-4 rounded-lg">
            <h3 className="font-semibold mb-2">تجربة رقمية متكاملة</h3>
            <p className="text-sm">إدارة كاملة لأموالك من خلال التطبيقات دون الحاجة لزيارة الفروع</p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="all" className="w-1/4">الكل</TabsTrigger>
          <TabsTrigger value="international" className="w-1/4">دولية</TabsTrigger>
          <TabsTrigger value="europe" className="w-1/4">أوروبية</TabsTrigger>
          <TabsTrigger value="middleEast" className="w-1/4">الشرق الأوسط</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">البنوك الموصى بها</h2>
            <Separator className="mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digitalBanks.filter(bank => 
                bank.transferFees.includes("منخفضة") || 
                parseFloat(bank.transferFees.replace(/[^\d.]/g, '')) < 5
              ).map(renderBankCard)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {digitalBanks.filter(bank => 
              !(bank.transferFees.includes("منخفضة") || 
              parseFloat(bank.transferFees.replace(/[^\d.]/g, '')) < 5)
            ).map(renderBankCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="international">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internationalBanks.map(renderBankCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="europe">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {europeBanks.map(renderBankCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="middleEast">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {middleEastBanks.map(renderBankCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DigitalBanksPage;