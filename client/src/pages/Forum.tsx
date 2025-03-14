import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MessageCircle, Search, ThumbsUp, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// بيانات وهمية للمنتدى (سيتم استبدالها بالبيانات الفعلية من API)
const forumTopics = [
  {
    id: 1,
    title: "أفضل طريقة للتحويل من Wise إلى بنك محلي؟",
    author: "أحمد محمد",
    avatar: "https://i.pravatar.cc/150?img=1",
    content: "أبحث عن أفضل طريقة للتحويل من حساب Wise إلى بنك محلي في مصر. هل هناك رسوم إضافية يجب أن أعرفها؟",
    category: "بنوك رقمية",
    createdAt: new Date(2023, 3, 15),
    replies: 12,
    views: 342,
    likes: 8,
    isPopular: true,
  },
  {
    id: 2,
    title: "توقعات أسعار البيتكوين بعد الهبوط الأخير",
    author: "سمير أحمد",
    avatar: "https://i.pravatar.cc/150?img=2",
    content: "ما هي توقعاتكم لأسعار البيتكوين بعد الهبوط الأخير؟ هل هناك مؤشرات للارتفاع قريباً؟",
    category: "عملات رقمية",
    createdAt: new Date(2023, 3, 18),
    replies: 25,
    views: 560,
    likes: 15,
    isPopular: true,
  },
  {
    id: 3,
    title: "تجربتي مع بنك Revolut وبطاقة السفر متعددة العملات",
    author: "ليلى عبدالله",
    avatar: "https://i.pravatar.cc/150?img=5",
    content: "أشارككم تجربتي مع بنك Revolut وبطاقة السفر متعددة العملات. استخدمتها في رحلتي الأخيرة إلى أوروبا...",
    category: "بنوك رقمية",
    createdAt: new Date(2023, 3, 20),
    replies: 8,
    views: 215,
    likes: 12,
    isPopular: false,
  },
  {
    id: 4,
    title: "استراتيجيات التداول في سوق العملات خلال التقلبات الاقتصادية",
    author: "فهد العنزي",
    avatar: "https://i.pravatar.cc/150?img=6",
    content: "أود مناقشة أفضل استراتيجيات التداول في سوق العملات خلال فترات التقلبات الاقتصادية الحالية...",
    category: "عملات تقليدية",
    createdAt: new Date(2023, 3, 22),
    replies: 15,
    views: 320,
    likes: 9,
    isPopular: false,
  },
  {
    id: 5,
    title: "مقارنة بين خدمات التحويل في Paysera و Wise",
    author: "عمر علي",
    avatar: "https://i.pravatar.cc/150?img=3",
    content: "هل هناك فرق كبير بين خدمات التحويل في Paysera و Wise من حيث الرسوم وسرعة التحويل؟",
    category: "بنوك رقمية",
    createdAt: new Date(2023, 3, 25),
    replies: 7,
    views: 180,
    likes: 5,
    isPopular: false,
  },
  {
    id: 6,
    title: "هل الاستثمار في Ethereum لا يزال مجدياً؟",
    author: "سارة محمود",
    avatar: "https://i.pravatar.cc/150?img=4",
    content: "مع التغييرات الأخيرة في شبكة Ethereum وانتقالها للإصدار 2.0، هل لا يزال الاستثمار فيها مجدياً؟",
    category: "عملات رقمية",
    createdAt: new Date(2023, 3, 28),
    replies: 18,
    views: 405,
    likes: 11,
    isPopular: true,
  }
];

const ForumPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // تنسيق التاريخ
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // تصفية المواضيع حسب البحث
  const filteredTopics = forumTopics.filter(topic => 
    topic.title.includes(searchQuery) || 
    topic.content.includes(searchQuery) || 
    topic.author.includes(searchQuery) ||
    topic.category.includes(searchQuery)
  );
  
  // تصفية المواضيع حسب التبويب النشط
  const getFilteredTopicsByTab = () => {
    if (activeTab === "all") return filteredTopics;
    if (activeTab === "popular") return filteredTopics.filter(topic => topic.isPopular);
    return filteredTopics.filter(topic => topic.category === activeTab);
  };
  
  // عرض بطاقة المواضيع
  const renderTopicCard = (topic: typeof forumTopics[0]) => {
    return (
      <Card key={topic.id} className="overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-lg hover:text-primary hover:underline cursor-pointer">
                {topic.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={topic.avatar} alt={topic.author} />
                  <AvatarFallback>{topic.author.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span>{topic.author}</span>
                <span>•</span>
                <Calendar className="h-3 w-3" />
                <span>{formatDate(topic.createdAt)}</span>
              </CardDescription>
            </div>
            <Badge>{topic.category}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm line-clamp-2">{topic.content}</p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" /> {topic.replies}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {topic.views}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" /> {topic.likes}
            </span>
          </div>
          <Button variant="ghost" size="sm">عرض الموضوع</Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{t("forum.pageTitle")}</h1>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-2/3">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ابحث في المنتدى..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6 grid grid-cols-4">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="popular">الأكثر تفاعلاً</TabsTrigger>
              <TabsTrigger value="عملات رقمية">عملات رقمية</TabsTrigger>
              <TabsTrigger value="بنوك رقمية">بنوك رقمية</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {getFilteredTopicsByTab().map(renderTopicCard)}
            </TabsContent>
            
            <TabsContent value="popular" className="space-y-4">
              {getFilteredTopicsByTab().map(renderTopicCard)}
            </TabsContent>
            
            <TabsContent value="عملات رقمية" className="space-y-4">
              {getFilteredTopicsByTab().map(renderTopicCard)}
            </TabsContent>
            
            <TabsContent value="بنوك رقمية" className="space-y-4">
              {getFilteredTopicsByTab().map(renderTopicCard)}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>أضف موضوعاً جديداً</CardTitle>
              <CardDescription>شارك استفسارك أو تجربتك مع المجتمع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input placeholder="عنوان الموضوع" />
              </div>
              <div>
                <Textarea placeholder="محتوى الموضوع" className="min-h-32" />
              </div>
              <div>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">اختر التصنيف</option>
                  <option value="عملات رقمية">عملات رقمية</option>
                  <option value="عملات تقليدية">عملات تقليدية</option>
                  <option value="بنوك رقمية">بنوك رقمية</option>
                  <option value="استفسارات عامة">استفسارات عامة</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">نشر الموضوع</Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>إحصائيات المنتدى</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">المواضيع:</span>
                <span className="font-medium">125</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">المشاركات:</span>
                <span className="font-medium">1,240</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">الأعضاء:</span>
                <span className="font-medium">450</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">آخر عضو:</span>
                <span className="font-medium hover:text-primary hover:underline cursor-pointer">محمد علي</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;