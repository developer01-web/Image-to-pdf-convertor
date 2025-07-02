import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversionSchema, insertAnalyticsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "PDF Converter API is running" });
  });

  // Track PDF conversion
  app.post("/api/conversions", async (req, res) => {
    try {
      const conversionData = insertConversionSchema.parse(req.body);
      const conversion = await storage.createConversion(conversionData);
      res.json({ success: true, conversion });
    } catch (error) {
      console.error("Error tracking conversion:", error);
      res.status(400).json({ error: "Invalid conversion data" });
    }
  });

  // Get conversions by session
  app.get("/api/conversions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const conversions = await storage.getConversionsBySession(sessionId);
      res.json({ conversions });
    } catch (error) {
      console.error("Error fetching conversions:", error);
      res.status(500).json({ error: "Failed to fetch conversions" });
    }
  });

  // Track analytics events
  app.post("/api/analytics", async (req, res) => {
    try {
      const analyticsData = insertAnalyticsSchema.parse(req.body);
      const analytics = await storage.trackAnalytics(analyticsData);
      res.json({ success: true, analytics });
    } catch (error) {
      console.error("Error tracking analytics:", error);
      res.status(400).json({ error: "Invalid analytics data" });
    }
  });

  // Get analytics dashboard data (simple stats)
  app.get("/api/analytics/stats", async (req, res) => {
    try {
      // Basic analytics - could be expanded with more complex queries
      res.json({ 
        message: "Analytics dashboard endpoint ready",
        totalConversions: 0,
        totalUsers: 0
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
