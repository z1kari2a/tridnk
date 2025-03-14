import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";

const NewsPage = () => {
  const { t } = useTranslation();
  
  // استعلام عن جميع الأخبار
  const { data: newsItems, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  // تجميع الأخبار حسب الفئة
  const categorizedNews = {
    crypto: newsItems?.filter(item => item.category === "crypto") || [],
    currencies: newsItems?.filter(item => item.category === "currencies") || [],
    digitalBanking: newsItems?.filter(item => item.category === "digitalBanking") || [],
  };

  // دالة لتحويل التصنيف إلى نص عربي مناسب
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "crypto":
        return "عملات رقمية";
      case "currencies":
        return "عملات تقليدية";
      case "digitalBanking":
        return "بنوك رقمية";
      default:
        return category;
    }
  };

  // دالة لتنسيق التاريخ
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("news.pageTitle")}</h1>
      
      {/* آخر الأخبار */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{t("news.latestNews")}</h2>
        <Separator className="mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems?.slice(0, 6).map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
                <Badge className="absolute top-2 right-2 bg-primary">
                  {getCategoryLabel(item.category)}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                <CardDescription>{formatDate(item.publishedAt)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-3">{item.summary}</p>
                <div className="mt-4">
                  <a href={`/news/${item.id}`} className="text-primary hover:underline">
                    قراءة المزيد
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* أخبار حسب الفئة */}
      {Object.entries(categorizedNews).map(([category, items]) => (
        items.length > 0 && (
          <section key={category} className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{getCategoryLabel(category)}</h2>
            <Separator className="mb-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.slice(0, 4).map((item) => (
                <Card key={item.id} className="flex flex-row overflow-hidden">
                  <div className="w-1/3 h-auto">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-4">
                    <h3 className="font-bold mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{formatDate(item.publishedAt)}</p>
                    <p className="text-sm line-clamp-2">{item.summary}</p>
                    <a href={`/news/${item.id}`} className="text-primary text-sm mt-2 block hover:underline">
                      قراءة المزيد
                    </a>
                  </div>
                </Card>
              ))}
            </div>
            
            {items.length > 4 && (
              <div className="text-center mt-6">
                <a href={`/news/category/${category}`} className="text-primary hover:underline">
                  عرض كل أخبار {getCategoryLabel(category)}
                </a>
              </div>
            )}
          </section>
        )
      ))}
    </div>
  );
};

export default NewsPage;