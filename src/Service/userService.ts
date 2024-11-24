import { IUserService } from "../Interface/IuserService";
import { IUser } from "../DTO/UserDto";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI || "";
const client = new MongoClient(uri);

export class UserService implements IUserService {
  async registerUser(user: IUser): Promise<IUser> {
    try {
      await client.connect();
      const db = client.db("mydatabase");
      const collection = db.collection("users");

      // Insert user into the database
      const result = await collection.insertOne(user);

      // Add the generated ID to the user object
      return { ...user, id: result.insertedId.toString() };
    } catch (error) {
      console.error("Error registering user:", error);
      throw new Error("Failed to register user");
    } finally {
      await client.close();
    }
  }

  async loginUser(email: string, password: string): Promise<IUser | null> {
    try {
      await client.connect();
      const db = client.db("mydatabase");
      const collection = db.collection("users");

      // Find the user by email and password
      const user = await collection.findOne<IUser>({ email, password });
      return user ? { ...user, id: user._id?.toString() } : null;
    } catch (error) {
      console.error("Error logging in user:", error);
      throw new Error("Failed to login user");
    } finally {
      await client.close();
    }
  }
}
