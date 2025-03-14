import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Arabic translations
const arTranslations = {
  header: {
    title: "صرافة الرقمية"
  },
  nav: {
    home: "الرئيسية",
    currencyRates: "أسعار العملات",
    digitalBanks: "البنوك الرقمية",
    crypto: "العملات المشفرة",
    news: "الأخبار"
  },
  hero: {
    title: "مقارنة أسعار العملات والبنوك الرقمية",
    description: "احصل على أحدث أسعار الصرف للعملات الرئيسية، وقارن بين الخدمات المصرفية الرقمية بشكل فوري.",
    comparePrices: "مقارنة الأسعار",
    latestNews: "آخر الأخبار"
  },
  currencyRate: {
    title: "أسعار الصرف المباشرة",
    autoUpdate: "تحديث تلقائي",
    seconds: "ثواني",
    open: "الافتتاح",
    high: "الأعلى"
  },
  calculator: {
    title: "حاسبة تحويل العملات",
    amount: "المبلغ",
    equivalent: "ما يعادله",
    exchangeRate: "سعر الصرف",
    lastUpdated: "آخر تحديث",
    refresh: "تحديث",
    selectCurrency: "اختر العملة",
    secondsAgo: "منذ {{count}} ثانية",
    minutesAgo: "منذ {{count}} دقيقة",
    hoursAgo: "منذ {{count}} ساعة"
  },
  digitalBanks: {
    title: "مقارنة البنوك الرقمية",
    service: "الخدمة",
    transferFees: "رسوم التحويل",
    exchangeRate: "سعر الصرف",
    transferSpeed: "سرعة التحويل",
    supportedCountries: "الدول المدعومة"
  },
  news: {
    title: "آخر أخبار العملات والبنوك الرقمية",
    readMore: "قراءة المزيد",
    viewAll: "عرض جميع الأخبار",
    categories: {
      crypto: "العملات المشفرة",
      digitalBanking: "البنوك الرقمية",
      currencies: "أسعار العملات"
    }
  },
  notifications: {
    title: "الإشعارات",
    viewAll: "عرض الكل",
    empty: "لا توجد إشعارات",
    manageSettings: "إدارة إعدادات الإشعارات",
    toggle: "إظهار الإشعارات",
    justNow: "الآن",
    minutesAgo: "منذ {{count}} دقيقة",
    hoursAgo: "منذ {{count}} ساعة",
    daysAgo: "منذ {{count}} يوم"
  },
  footer: {
    title: "صرافة الرقمية",
    description: "المنصة الأولى لمقارنة أسعار العملات والخدمات المالية الرقمية بشكل مباشر وفوري.",
    quickLinks: "روابط سريعة",
    contactUs: "تواصل معنا",
    newsletter: "النشرة الإخبارية",
    subscribeText: "اشترك للحصول على آخر أخبار العملات والتحديثات المالية.",
    emailPlaceholder: "بريدك الإلكتروني",
    copyright: "© {{year}} صرافة الرقمية. جميع الحقوق محفوظة."
  },
  currencies: {
    usd: "دولار أمريكي (USD)",
    eur: "يورو (EUR)",
    gbp: "جنيه إسترليني (GBP)",
    jpy: "ين ياباني (JPY)",
    btc: "بيتكوين (BTC)"
  },
  errors: {
    fetchingData: "حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.",
    fetchingRates: "فشل في تحميل أسعار العملات",
    fetchingBanks: "فشل في تحميل بيانات البنوك الرقمية",
    fetchingNews: "فشل في تحميل الأخبار"
  },
  common: {
    loading: "جاري التحميل...",
    toggleTheme: "تبديل المظهر"
  }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: arTranslations
      }
    },
    lng: "ar", // Default language
    fallbackLng: "ar",
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
