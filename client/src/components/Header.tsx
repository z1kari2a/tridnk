import { useState, useEffect } from "react";
import { Link } from "wouter";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import MobileMenu from "./MobileMenu";
import { useTranslation } from "react-i18next";
import { ChartLine, Search } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

const Header = () => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      setIsDarkMode(true);
    } else if (theme === "light") {
      setIsDarkMode(false);
    } else {
      // Check system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(systemTheme);
    }
  }, [theme]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header dir="rtl" className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-sm`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <ChartLine className={`${isDarkMode ? 'text-primary-400' : 'text-primary-600'} h-5 w-5`} />
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-primary-800'}`}>
              {t("header.title")}
            </h1>
          </div>
        </div>

        {/* Center Navigation - Desktop Only */}
        <div className="hidden md:flex absolute left-1/2 top-3 transform -translate-x-1/2">
          <nav className={`rounded-full px-4 py-1 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} shadow-md`}>
            <ul className="flex items-center space-x-1 space-x-reverse">
              <li>
                <Link href="/">
                  <a className="py-1 px-3 hover:bg-primary/20 rounded-full transition-colors duration-200 font-medium text-sm">
                    الرئيسية
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/currency-rates">
                  <a className="py-1 px-3 hover:bg-primary/20 rounded-full transition-colors duration-200 font-medium text-sm">
                    أسعار العملات
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/digital-banks">
                  <a className="py-1 px-3 hover:bg-primary/20 rounded-full transition-colors duration-200 font-medium text-sm">
                    البنوك الرقمية
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/crypto">
                  <a className="py-1 px-3 hover:bg-primary/20 rounded-full transition-colors duration-200 font-medium text-sm">
                    العملات المشفرة
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:flex">
            <Search className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
          <ThemeToggle />
          <NotificationBell />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`md:hidden p-1 rounded-md ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Secondary Navigation */}
      <nav className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} border-t border-b`}>
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center justify-between py-2 text-sm">
            <div className="flex space-x-6 space-x-reverse">
              <Link href="/news">
                <a className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-primary transition-colors duration-200`}>
                  الأخبار
                </a>
              </Link>
              <Link href="/forum">
                <a className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-primary transition-colors duration-200`}>
                  المنتدى
                </a>
              </Link>
              <Link href="/about">
                <a className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-primary transition-colors duration-200`}>
                  عن الموقع
                </a>
              </Link>
            </div>
            <div>
              <Link href="/login">
                <a className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-primary transition-colors duration-200`}>
                  لوحة التحكم
                </a>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Container - Only visible when menu is open */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="container mx-auto">
            <MobileMenu isOpen={mobileMenuOpen} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
