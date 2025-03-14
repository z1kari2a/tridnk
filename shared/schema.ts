import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table from the original schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Currency pairs table
export const currencyPairs = pgTable("currency_pairs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  baseCurrency: text("base_currency").notNull(),
  quoteCurrency: text("quote_currency").notNull(),
  rate: text("rate").notNull(),
  change24h: text("change_24h").notNull(),
  changePercent: text("change_percent").notNull(),
  high24h: text("high_24h").notNull(),
  low24h: text("low_24h").notNull(),
  open24h: text("open_24h").notNull(),
  type: text("type").notNull(), // fiat or crypto
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCurrencyPairSchema = createInsertSchema(currencyPairs).omit({
  id: true,
  updatedAt: true,
});

// Digital banks table
export const digitalBanks = pgTable("digital_banks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website").notNull(),
  logoUrl: text("logo_url").notNull(),
  transferFees: text("transfer_fees").notNull(),
  exchangeRate: text("exchange_rate").notNull(),
  transferSpeed: text("transfer_speed").notNull(),
  supportedCountries: text("supported_countries").notNull(),
  currencyRates: jsonb("currency_rates").notNull().default({}), // أسعار صرف العملات
  blackMarketRates: jsonb("black_market_rates").notNull().default({}), // أسعار السوق السوداء
});

export const insertDigitalBankSchema = createInsertSchema(digitalBanks).omit({
  id: true,
});

// News table
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(), // crypto, digitalBanking, currencies
  imageUrl: text("image_url").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // info, success, warning, error
  icon: text("icon").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
}).extend({
  read: z.boolean().optional().default(false),
});

// Exchange rates data for the calculator
export const exchangeRates = pgTable("exchange_rates", {
  id: serial("id").primaryKey(),
  baseCurrency: text("base_currency").notNull(),
  rates: jsonb("rates").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertExchangeRateSchema = createInsertSchema(exchangeRates).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type CurrencyPair = typeof currencyPairs.$inferSelect;
export type InsertCurrencyPair = z.infer<typeof insertCurrencyPairSchema>;

export type DigitalBank = typeof digitalBanks.$inferSelect;
export type InsertDigitalBank = z.infer<typeof insertDigitalBankSchema>;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type ExchangeRate = typeof exchangeRates.$inferSelect;
export type InsertExchangeRate = z.infer<typeof insertExchangeRateSchema>;
