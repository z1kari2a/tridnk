import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  Send 
} from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{t("footer.title")}</h3>
            <p className="text-gray-400 text-sm">{t("footer.description")}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white text-sm">{t("nav.home")}</a>
                </Link>
              </li>
              <li>
                <Link href="/currency-rates">
                  <a className="text-gray-400 hover:text-white text-sm">{t("nav.currencyRates")}</a>
                </Link>
              </li>
              <li>
                <Link href="/digital-banks">
                  <a className="text-gray-400 hover:text-white text-sm">{t("nav.digitalBanks")}</a>
                </Link>
              </li>
              <li>
                <Link href="/crypto">
                  <a className="text-gray-400 hover:text-white text-sm">{t("nav.crypto")}</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">{t("footer.contactUs")}</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="text-gray-400 ml-2 h-4 w-4" />
                <a
                  href="mailto:info@digital-exchange.com"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  info@digital-exchange.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="text-gray-400 ml-2 h-4 w-4" />
                <span className="text-gray-400 text-sm">+966 12 345 6789</span>
              </li>
            </ul>
            <div className="mt-4 flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">{t("footer.newsletter")}</h3>
            <p className="text-gray-400 text-sm mb-2">{t("footer.subscribeText")}</p>
            <div className="flex">
              <Input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="py-2 px-3 text-gray-700 bg-gray-200 rounded-r-lg w-full"
              />
              <Button className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-l-lg">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400 text-center">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
