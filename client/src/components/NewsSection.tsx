import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

const NewsSection = () => {
  const { t } = useTranslation();
  
  const { data: news, isLoading, isError } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });
  
  const getCategoryBadgeStyles = (category: string) => {
    switch (category) {
      case "crypto":
        return "bg-amber-100 text-amber-800";
      case "digitalBanking":
        return "bg-primary-100 text-primary-800";
      case "currencies":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getCategoryName = (category: string) => {
    switch (category) {
      case "crypto":
        return t("news.categories.crypto");
      case "digitalBanking":
        return t("news.categories.digitalBanking");
      case "currencies":
        return t("news.categories.currencies");
      default:
        return category;
    }
  };
  
  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: ar 
    });
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Newspaper className="text-primary-600 mr-2 h-5 w-5" />
        {t("news.title")}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="w-full h-40" />
              <div className="p-4">
                <Skeleton className="h-6 w-16 rounded-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <div className="mt-3 flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </Card>
          ))
        ) : isError ? (
          <div className="col-span-full text-center p-4 bg-red-50 text-red-500 rounded-lg">
            {t("errors.fetchingNews")}
          </div>
        ) : (
          news?.map((item) => (
            <Card key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-r from-gray-300 to-gray-100 flex items-center justify-center">
                  <Newspaper className="h-10 w-10 text-gray-400" />
                </div>
              </div>
              <div className="p-4">
                <Badge className={`inline-block px-2 py-1 leading-none ${getCategoryBadgeStyles(item.category)} rounded-full font-semibold uppercase tracking-wide text-xs`}>
                  {getCategoryName(item.category)}
                </Badge>
                <h3 className="mt-2 text-lg font-semibold leading-tight">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.summary}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{getTimeAgo(item.publishedAt)}</span>
                  <Button variant="link" className="text-primary-600 hover:text-primary-800 text-sm font-medium p-0">
                    {t("news.readMore")}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      
      <div className="text-center mt-6">
        <Button variant="outline" className="bg-white text-primary-600 hover:text-primary-700 font-medium py-2 px-4 border border-primary-200 rounded-lg transition">
          {t("news.viewAll")}
          <ArrowLeft className="mr-1 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default NewsSection;
