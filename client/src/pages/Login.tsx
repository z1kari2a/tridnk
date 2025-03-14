import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LockIcon, UserIcon } from "lucide-react";

// تعريف مخطط التحقق للنموذج
const loginSchema = z.object({
  username: z.string().min(1, { message: "اسم المستخدم مطلوب" }),
  password: z.string().min(1, { message: "كلمة المرور مطلوبة" })
});

// نوع البيانات المستخدمة في النموذج
type LoginFormValues = z.infer<typeof loginSchema>;

// بيانات المستخدم الافتراضية (في بيئة الإنتاج يجب استخدام API حقيقي)
const DEFAULT_ADMIN = {
  username: "admin",
  password: "admin123"
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  // تكوين نموذج تسجيل الدخول
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  // معالجة تقديم النموذج
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // محاكاة تأخير الاتصال بالخادم
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // التحقق من بيانات تسجيل الدخول (في بيئة الإنتاج يجب استخدام API حقيقي)
      if (data.username === DEFAULT_ADMIN.username && data.password === DEFAULT_ADMIN.password) {
        // تخزين حالة تسجيل الدخول
        localStorage.setItem("isLoggedIn", "true");
        
        // عرض رسالة نجاح
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحبًا بك في لوحة التحكم",
        });
        
        // الانتقال إلى صفحة الإدارة
        setLocation("/admin");
      } else {
        // عرض رسالة خطأ
        toast({
          variant: "destructive",
          title: "فشل تسجيل الدخول",
          description: "اسم المستخدم أو كلمة المرور غير صحيحة",
        });
      }
    } catch (error) {
      // عرض رسالة خطأ
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "يرجى المحاولة مرة أخرى لاحقًا",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
          <CardDescription>
            الرجاء إدخال بيانات الاعتماد الخاصة بك للوصول إلى لوحة التحكم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المستخدم</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          placeholder="أدخل اسم المستخدم" 
                          className="pr-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة المرور</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LockIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                          type="password" 
                          placeholder="أدخل كلمة المرور" 
                          className="pr-10" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          <div className="text-center">
            <p>بيانات الدخول الافتراضية:</p>
            <p>اسم المستخدم: admin</p>
            <p>كلمة المرور: admin123</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;