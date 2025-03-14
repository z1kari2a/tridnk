import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { WebSocketServer } from "ws";
import { fromZodError } from "zod-validation-error";

// WebSocket functionality
let wss: WebSocketServer;

function broadcastCurrencyUpdates() {
  const intervalId = setInterval(async () => {
    try {
      console.log("Updating currency rates...");
      const currencyPairs = await storage.getCurrencyPairs();
      
      // Simulate price changes
      const updatedPairs = currencyPairs.map(pair => {
        const currentRate = parseFloat(pair.rate);
        const randomChange = (Math.random() * 0.006 - 0.003) * currentRate;
        const newRate = (currentRate + randomChange).toFixed(4);
        
        const rateChange = (parseFloat(newRate) - currentRate).toFixed(4);
        const percentChange = ((parseFloat(rateChange) / currentRate) * 100).toFixed(2);
        
        // Update the pair in storage
        storage.updateCurrencyPair(pair.id, {
          rate: newRate,
          change24h: rateChange,
          changePercent: percentChange
        });
        
        return {
          ...pair,
          rate: newRate,
          change24h: rateChange,
          changePercent: percentChange,
          direction: randomChange >= 0 ? "up" : "down"
        };
      });
      
      console.log(`Updated ${updatedPairs.length} currency pairs`);
      
      // Only try to broadcast via WebSocket if wss exists and has clients
      if (wss && wss.clients.size > 0) {
        const message = JSON.stringify({
          type: "CURRENCY_UPDATE",
          data: updatedPairs
        });
        
        wss.clients.forEach(client => {
          if (client.readyState === 1) { // OPEN
            client.send(message);
          }
        });
        console.log(`Broadcast to ${wss.clients.size} WebSocket clients`);
      }
    } catch (error) {
      console.error("Error updating currency rates:", error);
    }
  }, 5000); // Update every 5 seconds

  // Store the interval ID to clear it later if needed
  return intervalId;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Initialize WebSocket server with a specific path
  wss = new WebSocketServer({ 
    server: httpServer,
    path: '/api/ws'  // Use a more specific path with /api prefix to avoid conflicts
  });
  
  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");
    
    ws.on("message", (message) => {
      console.log("Received message:", message);
    });
    
    ws.on("close", () => {
      console.log("Client disconnected from WebSocket");
    });
  });
  
  // Start broadcasting currency updates
  broadcastCurrencyUpdates();
  
  // API Endpoints
  // Prefix all routes with /api
  
  // Error handling middleware
  const handleApiError = (err: any, res: any) => {
    console.error("API Error:", err);
    
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ 
        error: "Validation Error", 
        details: validationError.message 
      });
    }
    
    return res.status(500).json({ 
      error: "Internal Server Error", 
      message: err.message || "An unexpected error occurred" 
    });
  };
  
  // Currency pairs endpoints
  app.get("/api/currency-pairs", async (req, res) => {
    try {
      const type = req.query.type as string;
      
      if (type) {
        const currencyPairs = await storage.getCurrencyPairsByType(type);
        return res.json(currencyPairs);
      }
      
      const currencyPairs = await storage.getCurrencyPairs();
      res.json(currencyPairs);
    } catch (err) {
      handleApiError(err, res);
    }
  });
  
  app.get("/api/currency-pairs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const currencyPair = await storage.getCurrencyPair(id);
      
      if (!currencyPair) {
        return res.status(404).json({ error: "Currency pair not found" });
      }
      
      res.json(currencyPair);
    } catch (err) {
      handleApiError(err, res);
    }
  });
  
  // Add PATCH endpoint for updating currency pairs
  app.patch("/api/currency-pairs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const currencyPair = await storage.getCurrencyPair(id);
      
      if (!currencyPair) {
        return res.status(404).json({ error: "Currency pair not found" });
      }
      
      // Update the currency pair
      const updatedPair = await storage.updateCurrencyPair(id, req.body);
      
      if (!updatedPair) {
        return res.status(500).json({ error: "Failed to update currency pair" });
      }
      
      res.json(updatedPair);
      
      // Log the manual update
      console.log(`Manual update to currency pair ${id}: ${JSON.stringify(req.body)}`);
    } catch (err) {
      handleApiError(err, res);
    }
  });
  
  // Digital banks endpoints
  app.get("/api/digital-banks", async (req, res) => {
    try {
      const digitalBanks = await storage.getDigitalBanks();
      res.json(digitalBanks);
    } catch (err) {
      handleApiError(err, res);
    }
  });
  
  app.get("/api/digital-banks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const digitalBank = await storage.getDigitalBank(id);
      
      if (!digitalBank) {
        return res.status(404).json({ error: "Digital bank not found" });
      }
      
      res.json(digitalBank);
    } catch (err) {
      handleApiError(err, res);
    }
  });
  
  // News endpoints
  app.get("/api/news", async (req, res) => {
    try {
      const category = req.query.category as string;
      
      if (category) {
        const news = await storage.getNewsByCategory(category);
        return res.json(news);
      }
      
      const news = await storage.getNews();
      res.json(news);
    } catch (err) {
      handleApiError(err, res);
    }
  });
  
  app.get("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const newsItem = await storage.getNewsItem(id);
      
      if (!newsItem) {
        return res.status(404).json({ error: "News item not found" });
      }
      
      res.json(newsItem);
    } catch (err) {
      handleApiError(err, res);
    }
  });
  
  // إضافة خبر جديد
  app.post("/api/news", async (req, res) => {
    try {
      const newsSchema = z.object({
        title: z.string().min(3, "العنوان يجب أن يكون على الأقل 3 أحرف"),
        content: z.string().min(10, "المحتوى يجب أن يكون على الأقل 10 أحرف"),
        summary: z.string().min(10, "الملخص يجب أن يكون على الأقل 10 أحرف"),
        category: z.string(),
        imageUrl: z.string(),
        publishedAt: z.string().optional().transform(date => date ? new Date(date) : undefined)
      });
      
      // التحقق من البيانات
      const validData = newsSchema.parse(req.body);
      
      // إنشاء خبر جديد
      const newsItem = await storage.createNewsItem(validData);
      
      res.status(201).json(newsItem);
    } catch (err) {
      handleApiError(err, res);
    }
  });
  
  // تحديث خبر موجود
  app.patch("/api/news/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      // التحقق من وجود الخبر
      const existingNews = await storage.getNewsItem(id);
      
      if (!existingNews) {
        return res.status(404).json({ error: "News item not found" });
      }
      
      const updateSchema = z.object({
        title: z.string().min(3, "العنوان يجب أن يكون على الأقل 3 أحرف").optional(),
        content: z.string().min(10, "المحتوى يجب أن يكون على الأقل 10 أحرف").optional(),
        summary: z.string().min(10, "الملخص يجب أن يكون على الأقل 10 أحرف").optional(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
        publishedAt: z.string().optional().transform(date => date ? new Date(date) : undefined)
      });
      
      // التحقق من البيانات
      const validData = updateSchema.parse(req.body);
      
      // تحديث الخبر باستخدام الدالة التي قمنا بإضافتها
      const updatedNews = await storage.updateNewsItem(id, validData);
      
      if (!updatedNews) {
        return res.status(500).json({ error: "Failed to update news item" });
      }
      
      res.json(updatedNews);
    } catch (err) {
      handleApiError(err, res);
    }
  });
  
  // Notifications endpoints
  app.get("/api/notifications", async (req, res) => {
    try {
      const notifications = await storage.getNotifications();
      res.json(notifications);
    } catch (err) {
      handleApiError(err, res);
    }
  });
  
  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      
      const updatedNotification = await storage.markNotificationAsRead(id);
      
      if (!updatedNotification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      
      res.json(updatedNotification);
    } catch (err) {
      handleApiError(err, res);
    }
  });
  
  // Exchange rates endpoints
  app.get("/api/exchange-rates", async (req, res) => {
    try {
      const baseCurrency = req.query.base as string;
      
      if (baseCurrency) {
        const exchangeRate = await storage.getExchangeRateByBaseCurrency(baseCurrency);
        
        if (!exchangeRate) {
          return res.status(404).json({ error: "Exchange rate not found for the specified base currency" });
        }
        
        return res.json(exchangeRate);
      }
      
      const exchangeRates = await storage.getExchangeRates();
      res.json(exchangeRates);
    } catch (err) {
      handleApiError(err, res);
    }
  });

  return httpServer;
}
