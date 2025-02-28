import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import logger from "@/app/utils/logger";

export class UserService {
  static async loadUserByEmail(email) {
    const client = await clientPromise;
    const db = client.db("shelterDB");
    return await db.collection("adminUsers").findOne({ email });
  }

  static async loadUserById(userId) {
    if (!userId) return null;
    
    try {
      const client = await clientPromise;
      const db = client.db("shelterDB");
      return await db.collection("adminUsers").findOne({ 
        _id: typeof userId === 'string' ? new ObjectId(userId) : userId 
      });
    } catch (error) {
      logger.error(error, 'UserService - loadUserById');
      return null;
    }
  }

  static get clientPromise() {
    return clientPromise;
  }
}