import {
  users, type User, type InsertUser,
  currencyPairs, type CurrencyPair, type InsertCurrencyPair,
  digitalBanks, type DigitalBank, type InsertDigitalBank,
  news, type News, type InsertNews,
  notifications, type Notification, type InsertNotification,
  exchangeRates, type ExchangeRate, type InsertExchangeRate
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Currency pairs operations
  getCurrencyPairs(): Promise<CurrencyPair[]>;
  getCurrencyPairsByType(type: string): Promise<CurrencyPair[]>;
  getCurrencyPair(id: number): Promise<CurrencyPair | undefined>;
  createCurrencyPair(currencyPair: InsertCurrencyPair): Promise<CurrencyPair>;
  updateCurrencyPair(id: number, currencyPair: Partial<InsertCurrencyPair>): Promise<CurrencyPair | undefined>;
  
  // Digital banks operations
  getDigitalBanks(): Promise<DigitalBank[]>;
  getDigitalBank(id: number): Promise<DigitalBank | undefined>;
  createDigitalBank(digitalBank: InsertDigitalBank): Promise<DigitalBank>;
  
  // News operations
  getNews(): Promise<News[]>;
  getNewsByCategory(category: string): Promise<News[]>;
  getNewsItem(id: number): Promise<News | undefined>;
  createNewsItem(newsItem: InsertNews): Promise<News>;
  updateNewsItem(id: number, newsItem: Partial<InsertNews>): Promise<News | undefined>;
  
  // Notifications operations
  getNotifications(): Promise<Notification[]>;
  getNotification(id: number): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  
  // Exchange rates operations
  getExchangeRates(): Promise<ExchangeRate[]>;
  getExchangeRateByBaseCurrency(baseCurrency: string): Promise<ExchangeRate | undefined>;
  createExchangeRate(exchangeRate: InsertExchangeRate): Promise<ExchangeRate>;
  updateExchangeRate(id: number, exchangeRate: Partial<InsertExchangeRate>): Promise<ExchangeRate | undefined>;
}

// Implementation for in-memory storage
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private currencyPairs: Map<number, CurrencyPair>;
  private digitalBanks: Map<number, DigitalBank>;
  private newsItems: Map<number, News>;
  private notificationsItems: Map<number, Notification>;
  private exchangeRatesItems: Map<number, ExchangeRate>;
  
  private userCurrentId: number;
  private currencyPairCurrentId: number;
  private digitalBankCurrentId: number;
  private newsCurrentId: number;
  private notificationCurrentId: number;
  private exchangeRateCurrentId: number;

  constructor() {
    this.users = new Map();
    this.currencyPairs = new Map();
    this.digitalBanks = new Map();
    this.newsItems = new Map();
    this.notificationsItems = new Map();
    this.exchangeRatesItems = new Map();
    
    this.userCurrentId = 1;
    this.currencyPairCurrentId = 1;
    this.digitalBankCurrentId = 1;
    this.newsCurrentId = 1;
    this.notificationCurrentId = 1;
    this.exchangeRateCurrentId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Initialize currency pairs
    const currencyPairsData: InsertCurrencyPair[] = [
      {
        name: "USD/EUR",
        baseCurrency: "USD",
        quoteCurrency: "EUR",
        rate: "0.9134",
        change24h: "0.0023",
        changePercent: "0.25",
        high24h: "0.9140",
        low24h: "0.9111",
        open24h: "0.9111",
        type: "fiat"
      },
      {
        name: "EUR/USD",
        baseCurrency: "EUR",
        quoteCurrency: "USD",
        rate: "1.0945",
        change24h: "-0.0024",
        changePercent: "-0.22",
        high24h: "1.0975",
        low24h: "1.0945",
        open24h: "1.0969",
        type: "fiat"
      },
      {
        name: "BTC/USD",
        baseCurrency: "BTC",
        quoteCurrency: "USD",
        rate: "37245.50",
        change24h: "668.25",
        changePercent: "1.83",
        high24h: "37350.00",
        low24h: "36577.25",
        open24h: "36577.25",
        type: "crypto"
      },
      {
        name: "ETH/USD",
        baseCurrency: "ETH",
        quoteCurrency: "USD",
        rate: "2018.75",
        change24h: "42.50",
        changePercent: "2.15",
        high24h: "2022.30",
        low24h: "1976.25",
        open24h: "1976.25",
        type: "crypto"
      }
    ];
    
    currencyPairsData.forEach(pair => {
      this.createCurrencyPair(pair);
    });
    
    // Initialize digital banks
    const digitalBanksData: InsertDigitalBank[] = [
      {
        name: "Wise",
        website: "wisecrypto.com",
        logoUrl: "/logos/wise.svg",
        transferFees: "0.5% - 1.5%",
        exchangeRate: "السعر المصرفي +0.5%",
        transferSpeed: "1-3 أيام عمل",
        supportedCountries: "170+ دولة",
        currencyRates: {
          "USD/EUR": 0.9125,
          "EUR/USD": 1.0962,
          "USD/GBP": 0.7845,
          "USD/JPY": 150.35,
          "USD/AED": 3.6725,
          "USD/SAR": 3.7500
        },
        blackMarketRates: {
          "USD/EGP": 65.75,
          "USD/LBP": 89500,
          "USD/SYP": 13750,
          "USD/IQD": 1460
        }
      },
      {
        name: "Paysera",
        website: "paysera.com",
        logoUrl: "/logos/paysera.svg",
        transferFees: "0.8% - 2.0%",
        exchangeRate: "السعر المصرفي +0.7%",
        transferSpeed: "1-2 يوم عمل",
        supportedCountries: "150+ دولة",
        currencyRates: {
          "USD/EUR": 0.9115,
          "EUR/USD": 1.0970,
          "USD/GBP": 0.7835,
          "USD/JPY": 150.45,
          "USD/AED": 3.6730,
          "USD/SAR": 3.7515
        },
        blackMarketRates: {
          "USD/EGP": 66.10,
          "USD/LBP": 89800,
          "USD/SYP": 13800,
          "USD/IQD": 1465
        }
      },
      {
        name: "Revolut",
        website: "revolut.com",
        logoUrl: "/logos/revolut.svg",
        transferFees: "0.4% - 1.8%",
        exchangeRate: "السعر المصرفي +1.0%",
        transferSpeed: "1-5 أيام عمل",
        supportedCountries: "120+ دولة",
        currencyRates: {
          "USD/EUR": 0.9142,
          "EUR/USD": 1.0938,
          "USD/GBP": 0.7862,
          "USD/JPY": 150.25,
          "USD/AED": 3.6720,
          "USD/SAR": 3.7490
        },
        blackMarketRates: {
          "USD/EGP": 65.90,
          "USD/LBP": 89200,
          "USD/SYP": 13680,
          "USD/IQD": 1455
        }
      }
    ];
    
    digitalBanksData.forEach(bank => {
      this.createDigitalBank(bank);
    });
    
    // Initialize news
    const newsData: InsertNews[] = [
      {
        title: "بيتكوين تشهد ارتفاعاً ملحوظاً بعد إقرار صناديق ETF",
        content: "تجاوزت عملة البيتكوين 37 ألف دولار للمرة الأولى منذ أشهر بعد موافقة هيئة الأوراق المالية على صناديق المؤشرات المتداولة للبيتكوين.",
        summary: "تجاوزت عملة البيتكوين 37 ألف دولار للمرة الأولى منذ أشهر بعد موافقة هيئة الأوراق المالية على صناديق المؤشرات المتداولة للبيتكوين.",
        category: "crypto",
        imageUrl: "/images/bitcoin-news.jpg",
        publishedAt: new Date()
      },
      {
        title: "Wise تطلق خدمات جديدة للأعمال التجارية في الشرق الأوسط",
        content: "أعلنت منصة Wise عن إطلاق باقة جديدة من الخدمات المصممة خصيصاً للشركات الصغيرة والمتوسطة في منطقة الشرق الأوسط.",
        summary: "أعلنت منصة Wise عن إطلاق باقة جديدة من الخدمات المصممة خصيصاً للشركات الصغيرة والمتوسطة في منطقة الشرق الأوسط.",
        category: "digitalBanking",
        imageUrl: "/images/wise-news.jpg",
        publishedAt: new Date()
      },
      {
        title: "اليورو يستعيد قوته أمام الدولار مع تحسن المؤشرات الاقتصادية",
        content: "شهد اليورو ارتفاعاً ملحوظاً أمام الدولار الأمريكي مع ظهور مؤشرات إيجابية حول تعافي الاقتصاد الأوروبي بعد أزمة التضخم.",
        summary: "شهد اليورو ارتفاعاً ملحوظاً أمام الدولار الأمريكي مع ظهور مؤشرات إيجابية حول تعافي الاقتصاد الأوروبي بعد أزمة التضخم.",
        category: "currencies",
        imageUrl: "/images/euro-news.jpg",
        publishedAt: new Date()
      }
    ];
    
    newsData.forEach(item => {
      this.createNewsItem(item);
    });
    
    // Initialize notifications
    const notificationsData: InsertNotification[] = [
      {
        title: "ارتفاع سعر الدولار مقابل اليورو",
        message: "سجل الدولار ارتفاعاً بنسبة 0.25% مقابل اليورو خلال الساعات الماضية",
        type: "success",
        icon: "arrow-up",
        read: false
      },
      {
        title: "انخفاض بيتكوين بنسبة 2.5%",
        message: "شهدت عملة البيتكوين انخفاضاً ملحوظاً خلال الساعات الماضية",
        type: "error",
        icon: "arrow-down",
        read: false
      },
      {
        title: "تحديث أسعار Wise للتحويلات",
        message: "تم تحديث أسعار التحويل في منصة Wise للعملات الرئيسية",
        type: "info",
        icon: "info",
        read: false
      }
    ];
    
    notificationsData.forEach(notification => {
      this.createNotification(notification);
    });
    
    // Initialize exchange rates
    const exchangeRatesData: InsertExchangeRate[] = [
      {
        baseCurrency: "USD",
        rates: {
          EUR: 0.9134,
          GBP: 0.7835,
          JPY: 150.25,
          BTC: 0.000027
        }
      },
      {
        baseCurrency: "EUR",
        rates: {
          USD: 1.0945,
          GBP: 0.8576,
          JPY: 164.50,
          BTC: 0.000029
        }
      },
      {
        baseCurrency: "GBP",
        rates: {
          USD: 1.2764,
          EUR: 1.1660,
          JPY: 191.82,
          BTC: 0.000034
        }
      },
      {
        baseCurrency: "JPY",
        rates: {
          USD: 0.00665,
          EUR: 0.00608,
          GBP: 0.00521,
          BTC: 0.00000018
        }
      },
      {
        baseCurrency: "BTC",
        rates: {
          USD: 37245.50,
          EUR: 34025.75,
          GBP: 29118.60,
          JPY: 5597675.25
        }
      }
    ];
    
    exchangeRatesData.forEach(rate => {
      this.createExchangeRate(rate);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Currency pairs methods
  async getCurrencyPairs(): Promise<CurrencyPair[]> {
    return Array.from(this.currencyPairs.values());
  }
  
  async getCurrencyPairsByType(type: string): Promise<CurrencyPair[]> {
    return Array.from(this.currencyPairs.values()).filter(
      (pair) => pair.type === type
    );
  }
  
  async getCurrencyPair(id: number): Promise<CurrencyPair | undefined> {
    return this.currencyPairs.get(id);
  }
  
  async createCurrencyPair(insertCurrencyPair: InsertCurrencyPair): Promise<CurrencyPair> {
    const id = this.currencyPairCurrentId++;
    const currencyPair: CurrencyPair = {
      ...insertCurrencyPair,
      id,
      updatedAt: new Date()
    };
    this.currencyPairs.set(id, currencyPair);
    return currencyPair;
  }
  
  async updateCurrencyPair(id: number, currencyPair: Partial<InsertCurrencyPair>): Promise<CurrencyPair | undefined> {
    const existingPair = this.currencyPairs.get(id);
    if (!existingPair) return undefined;
    
    const updatedPair: CurrencyPair = {
      ...existingPair,
      ...currencyPair,
      updatedAt: new Date()
    };
    
    this.currencyPairs.set(id, updatedPair);
    return updatedPair;
  }
  
  // Digital banks methods
  async getDigitalBanks(): Promise<DigitalBank[]> {
    return Array.from(this.digitalBanks.values());
  }
  
  async getDigitalBank(id: number): Promise<DigitalBank | undefined> {
    return this.digitalBanks.get(id);
  }
  
  async createDigitalBank(insertDigitalBank: InsertDigitalBank): Promise<DigitalBank> {
    const id = this.digitalBankCurrentId++;
    const digitalBank: DigitalBank = { ...insertDigitalBank, id };
    this.digitalBanks.set(id, digitalBank);
    return digitalBank;
  }
  
  // News methods
  async getNews(): Promise<News[]> {
    return Array.from(this.newsItems.values()).sort((a, b) => 
      b.publishedAt.getTime() - a.publishedAt.getTime()
    );
  }
  
  async getNewsByCategory(category: string): Promise<News[]> {
    return Array.from(this.newsItems.values())
      .filter((item) => item.category === category)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }
  
  async getNewsItem(id: number): Promise<News | undefined> {
    return this.newsItems.get(id);
  }
  
  async createNewsItem(insertNews: InsertNews): Promise<News> {
    const id = this.newsCurrentId++;
    const news: News = {
      ...insertNews,
      id,
      publishedAt: insertNews.publishedAt || new Date()
    };
    this.newsItems.set(id, news);
    return news;
  }
  
  async updateNewsItem(id: number, newsItem: Partial<InsertNews>): Promise<News | undefined> {
    const existingNews = this.newsItems.get(id);
    if (!existingNews) return undefined;
    
    const updatedNews: News = {
      ...existingNews,
      ...newsItem,
      // الحفاظ على تاريخ النشر الأصلي إذا لم يتم تحديثه
      publishedAt: newsItem.publishedAt ? new Date(newsItem.publishedAt) : existingNews.publishedAt
    };
    
    this.newsItems.set(id, updatedNews);
    return updatedNews;
  }
  
  // Notifications methods
  async getNotifications(): Promise<Notification[]> {
    return Array.from(this.notificationsItems.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
  
  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notificationsItems.get(id);
  }
  
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationCurrentId++;
    const notification: Notification = {
      ...insertNotification,
      id,
      read: insertNotification.read ?? false,
      createdAt: new Date()
    };
    this.notificationsItems.set(id, notification);
    return notification;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notificationsItems.get(id);
    if (!notification) return undefined;
    
    const updatedNotification: Notification = {
      ...notification,
      read: true
    };
    
    this.notificationsItems.set(id, updatedNotification);
    return updatedNotification;
  }
  
  // Exchange rates methods
  async getExchangeRates(): Promise<ExchangeRate[]> {
    return Array.from(this.exchangeRatesItems.values());
  }
  
  async getExchangeRateByBaseCurrency(baseCurrency: string): Promise<ExchangeRate | undefined> {
    return Array.from(this.exchangeRatesItems.values()).find(
      (rate) => rate.baseCurrency === baseCurrency
    );
  }
  
  async createExchangeRate(insertExchangeRate: InsertExchangeRate): Promise<ExchangeRate> {
    const id = this.exchangeRateCurrentId++;
    const exchangeRate: ExchangeRate = {
      ...insertExchangeRate,
      id,
      updatedAt: new Date()
    };
    this.exchangeRatesItems.set(id, exchangeRate);
    return exchangeRate;
  }
  
  async updateExchangeRate(id: number, exchangeRate: Partial<InsertExchangeRate>): Promise<ExchangeRate | undefined> {
    const existingRate = this.exchangeRatesItems.get(id);
    if (!existingRate) return undefined;
    
    const updatedRate: ExchangeRate = {
      ...existingRate,
      ...exchangeRate,
      updatedAt: new Date()
    };
    
    this.exchangeRatesItems.set(id, updatedRate);
    return updatedRate;
  }
}

export const storage = new MemStorage();
