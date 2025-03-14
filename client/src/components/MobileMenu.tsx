import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

interface MobileMenuProps {
  isOpen: boolean;
}

const MobileMenu = ({ isOpen }: MobileMenuProps) => {
  const { t } = useTranslation();
  const [pricesSubmenuOpen, setPricesSubmenuOpen] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  if (!isOpen) {
    return null;
  }

  const togglePricesSubmenu = () => {
    setPricesSubmenuOpen(!pricesSubmenuOpen);
  };

  // Featured links - match with center navigation
  const featuredLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/currency-rates", label: "أسعار العملات" },
    { href: "/digital-banks", label: "البنوك الرقمية" },
    { href: "/crypto", label: "العملات المشفرة" },
  ];

  // Secondary links - the rest of navigation
  const secondaryLinks = [
    { href: "/news", label: "الأخبار" },
    { href: "/forum", label: "المنتدى" },
    { href: "/about", label: "عن الموقع" },
    { href: "/login", label: "لوحة التحكم" },
  ];

  return (
    <div className="md:hidden py-2">
      {/* Featured Navigation Links */}
      <div className={`mb-2 pb-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
        <h3 className={`px-4 py-1 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>القائمة الرئيسية</h3>
        {featuredLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <a className={`block py-2 px-4 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {link.label}
            </a>
          </Link>
        ))}
      </div>
      
      {/* Secondary Navigation Links */}
      <div>
        <h3 className={`px-4 py-1 text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} uppercase`}>روابط أخرى</h3>
        {secondaryLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <a className={`block py-2 px-4 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {link.label}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
