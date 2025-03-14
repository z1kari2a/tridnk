import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrencyPair, DigitalBank, News, Notification, InsertNews } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ChevronUp, ChevronDown, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// مخطط نموذج الأخبار
const newsFormSchema = z.object({
  title: z.string().min(3, "العنوان يجب أن يكون على الأقل 3 أحرف"),
  content: z.string().min(10, "المحتوى يجب أن يكون على الأقل 10 أحرف"),
  summary: z.string().min(10, "الملخص يجب أن يكون على الأقل 10 أحرف"),
  category: z.string({
    required_error: "الرجاء اختيار تصنيف",
  }),
  imageUrl: z.string().min(1, "الرجاء إدخال رابط للصورة"),
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

// مكون نموذج الأخبار
interface NewsFormProps {
  onSubmit: (values: NewsFormValues) => void;
  isLoading: boolean;
  defaultValues?: News;
}

function NewsForm({ onSubmit, isLoading, defaultValues }: NewsFormProps) {
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: defaultValues ? {
      title: defaultValues.title,
      content: defaultValues.content,
      summary: defaultValues.summary,
      category: defaultValues.category,
      imageUrl: defaultValues.imageUrl,
    } : {
      title: "",
      content: "",
      summary: "",
      category: "",
      imageUrl: "",
    },
  });

  function onFormSubmit(values: NewsFormValues) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العنوان</FormLabel>
              <FormControl>
                <Input placeholder="أدخل عنوان الخبر" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الملخص</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="أدخل ملخصاً للخبر" 
                  className="min-h-[60px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المحتوى</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="أدخل محتوى الخبر الكامل" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>التصنيف</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر تصنيفاً للخبر" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="crypto">عملات رقمية</SelectItem>
                  <SelectItem value="currencies">عملات تقليدية</SelectItem>
                  <SelectItem value="digitalBanking">بنوك رقمية</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رابط الصورة</FormLabel>
              <FormControl>
                <Input placeholder="أدخل رابط الصورة" {...field} />
              </FormControl>
              <FormDescription>
                أدخل رابطاً لصورة متعلقة بالخبر (يفضل صورة مربعة)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "جارٍ الحفظ..." : "حفظ"}
        </Button>
      </form>
    </Form>
  );
}

const AdminPanel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("currencies");
  const [_, setLocation] = useLocation();
  
  // حالة إضافة وتعديل الأخبار
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [showEditNewsModal, setShowEditNewsModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  // إضافة خبر جديد - قطعة التعامل
  const addNewsMutation = useMutation({
    mutationFn: async (data: NewsFormValues) => {
      const res = await apiRequest("POST", "/api/news", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setShowAddNewsModal(false);
      toast({
        title: "تم إضافة الخبر",
        description: "تم إضافة الخبر الجديد بنجاح",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: `فشل إضافة الخبر: ${error}`,
      });
    },
  });

  // تحديث خبر موجود - قطعة التعامل
  const updateNewsMutation = useMutation({
    mutationFn: async (data: { id: number; updates: NewsFormValues }) => {
      const res = await apiRequest("PATCH", `/api/news/${data.id}`, data.updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setShowEditNewsModal(false);
      setSelectedNews(null);
      toast({
        title: "تم تحديث الخبر",
        description: "تم تحديث الخبر بنجاح",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: `فشل تحديث الخبر: ${error}`,
      });
    },
  });

  // معالجة إضافة خبر جديد
  const handleAddNews = (values: NewsFormValues) => {
    addNewsMutation.mutate(values);
  };

  // معالجة تحديث خبر موجود
  const handleUpdateNews = (values: NewsFormValues) => {
    if (selectedNews) {
      updateNewsMutation.mutate({
        id: selectedNews.id,
        updates: values,
      });
    }
  };
  
  // حالة تحميل البيانات
  const addNewsLoading = addNewsMutation.isPending;
  const updateNewsLoading = updateNewsMutation.isPending;

  // Fetch all data
  const { data: currencyPairs, isLoading: isLoadingCurrencies } = useQuery<CurrencyPair[]>({
    queryKey: ["/api/currency-pairs"],
  });

  const { data: banks, isLoading: isLoadingBanks } = useQuery<DigitalBank[]>({
    queryKey: ["/api/digital-banks"],
  });

  const { data: news, isLoading: isLoadingNews } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const { data: notifications, isLoading: isLoadingNotifications } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  // Update currency pair mutation
  const updateCurrencyPairMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<CurrencyPair> }) => {
      const res = await apiRequest("PATCH", `/api/currency-pairs/${data.id}`, data.updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/currency-pairs"] });
      toast({
        title: "تم تحديث سعر العملة",
        description: "تم تحديث سعر العملة بنجاح",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: `فشل تحديث سعر العملة: ${error}`,
      });
    },
  });

  // Handle manual rate change
  const handleRateChange = (id: number, rate: string) => {
    updateCurrencyPairMutation.mutate({
      id,
      updates: { rate },
    });
  };

  // Manual adjustment buttons
  const adjustRate = (pair: CurrencyPair, direction: "up" | "down") => {
    const currentRate = parseFloat(pair.rate);
    const adjustment = direction === "up" ? 0.0001 : -0.0001;
    const newRate = (currentRate + adjustment).toFixed(4);
    
    updateCurrencyPairMutation.mutate({
      id: pair.id,
      updates: { 
        rate: newRate,
        change24h: adjustment.toFixed(4),
        changePercent: ((adjustment / currentRate) * 100).toFixed(2)
      },
    });
  };

  // Refresh data
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/currency-pairs"] });
    queryClient.invalidateQueries({ queryKey: ["/api/digital-banks"] });
    queryClient.invalidateQueries({ queryKey: ["/api/news"] });
    queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    
    toast({
      title: "تم تحديث البيانات",
      description: "تم تحديث جميع البيانات من الخادم",
    });
  };
  
  // Handle logout
  const handleLogout = () => {
    // حذف حالة تسجيل الدخول
    localStorage.removeItem("isLoggedIn");
    
    // إظهار رسالة
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل الخروج بنجاح",
    });
    
    // الانتقال إلى صفحة تسجيل الدخول
    setLocation("/login");
  };

  // Render loading state
  if (isLoadingCurrencies || isLoadingBanks || isLoadingNews || isLoadingNotifications) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-xl">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <div className="flex gap-2">
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
          <Button onClick={refreshData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            تحديث البيانات
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="currencies" className="flex-1">أسعار العملات</TabsTrigger>
          <TabsTrigger value="banks" className="flex-1">البنوك الرقمية</TabsTrigger>
          <TabsTrigger value="news" className="flex-1">الأخبار</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">الإشعارات</TabsTrigger>
        </TabsList>

        <TabsContent value="currencies">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currencyPairs?.map((pair) => (
              <Card key={pair.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{pair.name}</CardTitle>
                  <CardDescription>
                    {pair.type === "fiat" ? "عملة تقليدية" : "عملة رقمية"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4 items-end">
                      <div>
                        <Label htmlFor={`rate-${pair.id}`}>السعر الحالي</Label>
                        <div className="flex">
                          <Input
                            id={`rate-${pair.id}`}
                            type="text"
                            value={pair.rate}
                            onChange={(e) => handleRateChange(pair.id, e.target.value)}
                            className="flex-1"
                          />
                          <div className="flex flex-col ml-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="mb-1 h-8 w-8"
                              onClick={() => adjustRate(pair, "up")}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => adjustRate(pair, "down")}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`change-${pair.id}`}>التغير (24 ساعة)</Label>
                        <div className="flex items-center">
                          <span className={pair.changePercent.startsWith("-") ? "text-red-500" : "text-green-500"}>
                            {pair.changePercent}%
                          </span>
                          <span className="mx-2">|</span>
                          <span>{pair.change24h}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="banks">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banks?.map((bank) => (
              <Card key={bank.id}>
                <CardHeader>
                  <CardTitle>{bank.name}</CardTitle>
                  <CardDescription>{bank.website}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Label>رسوم التحويل</Label>
                      <p>{bank.transferFees}</p>
                    </div>
                    <div>
                      <Label>سعر الصرف</Label>
                      <p>{bank.exchangeRate}</p>
                    </div>
                    <div>
                      <Label>سرعة التحويل</Label>
                      <p>{bank.transferSpeed}</p>
                    </div>
                    <div>
                      <Label>الدول المدعومة</Label>
                      <p>{bank.supportedCountries}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="news">
          <div className="mb-6">
            <Button className="w-full" variant="default" onClick={() => setShowAddNewsModal(true)}>
              إضافة خبر جديد
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {news?.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>
                        {new Date(item.publishedAt).toLocaleDateString("ar-EG")} | {item.category}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setSelectedNews(item);
                        setShowEditNewsModal(true);
                      }}
                    >
                      تعديل
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <Label className="font-bold">الملخص:</Label>
                      <p className="text-sm">{item.summary}</p>
                    </div>
                    
                    <div>
                      <Label className="font-bold">المحتوى:</Label>
                      <p className="text-sm">{item.content}</p>
                    </div>
                    
                    {item.imageUrl && (
                      <div className="mt-4">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="rounded-md max-h-40 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Modal لإضافة خبر جديد */}
          <Dialog open={showAddNewsModal} onOpenChange={setShowAddNewsModal}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>إضافة خبر جديد</DialogTitle>
                <DialogDescription>
                  قم بإدخال تفاصيل الخبر الجديد هنا. انقر على حفظ عند الانتهاء.
                </DialogDescription>
              </DialogHeader>
              <NewsForm onSubmit={handleAddNews} isLoading={addNewsLoading} />
            </DialogContent>
          </Dialog>
          
          {/* Modal لتعديل خبر موجود */}
          <Dialog open={showEditNewsModal} onOpenChange={setShowEditNewsModal}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>تعديل الخبر</DialogTitle>
                <DialogDescription>
                  قم بتعديل تفاصيل الخبر هنا. انقر على حفظ عند الانتهاء.
                </DialogDescription>
              </DialogHeader>
              {selectedNews && (
                <NewsForm 
                  onSubmit={handleUpdateNews} 
                  isLoading={updateNewsLoading} 
                  defaultValues={selectedNews}
                />
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="grid grid-cols-1 gap-4">
            {notifications?.map((notification) => (
              <Card key={notification.id}>
                <CardHeader>
                  <CardTitle>{notification.title}</CardTitle>
                  <CardDescription>
                    {new Date(notification.createdAt).toLocaleDateString("ar-EG")} |
                    {notification.read ? " تمت القراءة" : " غير مقروء"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{notification.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;