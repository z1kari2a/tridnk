import { useEffect } from "react";
import { useLocation } from "wouter";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * مكون للتحقق من حالة تسجيل الدخول وتوجيه المستخدم إلى صفحة تسجيل الدخول
 * إذا لم يكن مسجلاً
 */
const AuthGuard = ({ children }: AuthGuardProps) => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    // إذا لم يكن المستخدم مسجلاً، توجيهه إلى صفحة تسجيل الدخول
    if (!isLoggedIn) {
      setLocation("/login");
    }
  }, [setLocation]);

  return <>{children}</>;
};

export default AuthGuard;