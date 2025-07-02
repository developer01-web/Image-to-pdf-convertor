import { users, conversions, analytics, type User, type InsertUser, type Conversion, type InsertConversion, type Analytics, type InsertAnalytics } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createConversion(conversion: InsertConversion): Promise<Conversion>;
  getConversionsBySession(sessionId: string): Promise<Conversion[]>;
  trackAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createConversion(insertConversion: InsertConversion): Promise<Conversion> {
    const [conversion] = await db
      .insert(conversions)
      .values(insertConversion)
      .returning();
    return conversion;
  }

  async getConversionsBySession(sessionId: string): Promise<Conversion[]> {
    return await db
      .select()
      .from(conversions)
      .where(eq(conversions.sessionId, sessionId));
  }

  async trackAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const [analytic] = await db
      .insert(analytics)
      .values(insertAnalytics)
      .returning();
    return analytic;
  }
}

export const storage = new DatabaseStorage();
