import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversions = pgTable("conversions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  sessionId: text("session_id").notNull(),
  filename: text("filename").notNull(),
  imageCount: integer("image_count").notNull(),
  settings: jsonb("settings").notNull(),
  fileSize: integer("file_size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  event: text("event").notNull(),
  sessionId: text("session_id").notNull(),
  userId: integer("user_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  conversions: many(conversions),
  analytics: many(analytics),
}));

export const conversionsRelations = relations(conversions, ({ one }) => ({
  user: one(users, {
    fields: [conversions.userId],
    references: [users.id],
  }),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  user: one(users, {
    fields: [analytics.userId],
    references: [users.id],
  }),
}));

// PDF conversion settings schema for type safety
export const pdfSettingsSchema = z.object({
  orientation: z.enum(['portrait', 'landscape']).default('portrait'),
  imageFit: z.enum(['contain', 'cover', 'stretch', 'center']).default('contain'),
  margins: z.object({
    top: z.number().min(0).max(50).default(20),
    bottom: z.number().min(0).max(50).default(20),
    left: z.number().min(0).max(50).default(20),
    right: z.number().min(0).max(50).default(20),
  }).default({
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  }),
  title: z.string().optional(),
  header: z.string().optional(),
  footer: z.string().optional(),
  watermark: z.string().optional(),
  quality: z.enum(['high', 'medium', 'low']).default('medium'),
});

export type PDFSettings = z.infer<typeof pdfSettingsSchema>;

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertConversionSchema = createInsertSchema(conversions).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Conversion = typeof conversions.$inferSelect;
export type InsertConversion = z.infer<typeof insertConversionSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
