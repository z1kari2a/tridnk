import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChartLine, Users, Award, ArrowUpRight, Mail, Globe, MapPin, Phone } from "lucide-react";

const AboutPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">{t("about.pageTitle")}</h1>
        <p className="text-center text-muted-foreground mb-8">منصة معلومات شاملة للأسواق المالية والبنوك الرقمية</p>
        
        <div className="grid gap-8">
          {/* من نحن */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <ChartLine className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-4">من نحن</h2>
              <p className="text-center mb-4">
                نحن منصة متخصصة في توفير معلومات حية ودقيقة حول أسعار العملات التقليدية والرقمية، بالإضافة إلى مقارنات شاملة بين البنوك والمحافظ الرقمية العالمية.
              </p>
              <p className="text-center">
                تأسست المنصة في عام 2023 بهدف تسهيل الوصول للمعلومات المالية للمستخدمين العرب وتوفير محتوى عربي عالي الجودة في مجال التقنية المالية.
              </p>
            </CardContent>
          </Card>
          
          {/* رؤيتنا ورسالتنا */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  رؤيتنا
                </h2>
                <p className="text-muted-foreground">
                  أن نكون المنصة الرائدة في تقديم المعلومات المالية والرقمية في العالم العربي، مما يساعد على رفع الوعي المالي ويمكّن المستخدمين من اتخاذ قرارات مالية أفضل.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  رسالتنا
                </h2>
                <p className="text-muted-foreground">
                  توفير معلومات دقيقة وحديثة بشكل مستمر، وتقديم محتوى تعليمي عالي الجودة، وبناء مجتمع تفاعلي يساهم في تبادل الخبرات والمعرفة في مجال التقنية المالية.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* خدماتنا */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-center mb-6">خدماتنا</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                    أسعار العملات الحية
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    توفير أسعار لحظية للعملات التقليدية والرقمية مع إمكانية المقارنة ومتابعة التغيرات.
                  </p>
                </div>
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                    مقارنة البنوك الرقمية
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    مقارنات تفصيلية بين البنوك والمحافظ الرقمية من حيث الرسوم والمميزات والخدمات.
                  </p>
                </div>
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                    أخبار ومقالات متخصصة
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    متابعة أحدث الأخبار والتطورات في عالم العملات والمال والتقنية المالية.
                  </p>
                </div>
                <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                    منتدى للنقاش وتبادل الخبرات
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    منصة تفاعلية لمناقشة المواضيع المتعلقة بالاستثمار والعملات والبنوك الرقمية.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* فريق العمل */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-center mb-6">فريق العمل</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="mx-auto rounded-full overflow-hidden w-24 h-24 mb-4">
                    <img 
                      src="https://i.pravatar.cc/150?img=1" 
                      alt="أحمد محمد" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold">أحمد محمد</h3>
                  <p className="text-sm text-muted-foreground">المؤسس والمدير التنفيذي</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto rounded-full overflow-hidden w-24 h-24 mb-4">
                    <img 
                      src="https://i.pravatar.cc/150?img=5" 
                      alt="سارة أحمد" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold">سارة أحمد</h3>
                  <p className="text-sm text-muted-foreground">مديرة المحتوى</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto rounded-full overflow-hidden w-24 h-24 mb-4">
                    <img 
                      src="https://i.pravatar.cc/150?img=3" 
                      alt="عمر خالد" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold">عمر خالد</h3>
                  <p className="text-sm text-muted-foreground">محلل مالي</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* تواصل معنا */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-center mb-6">تواصل معنا</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>info@financearab.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>+966 50 123 4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>الرياض، المملكة العربية السعودية</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>www.financearab.com</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">أرسل لنا رسالة</h3>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="الاسم" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    <input 
                      type="email" 
                      placeholder="البريد الإلكتروني" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    <textarea 
                      placeholder="الرسالة" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                    ></textarea>
                    <Button className="w-full">إرسال</Button>
                  </div>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="text-center text-sm text-muted-foreground">
                © 2023-2025 FinanceArab. جميع الحقوق محفوظة.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;