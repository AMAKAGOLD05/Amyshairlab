import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "amys-hairlab";

type MongoCache = {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
};

const globalForMongo = globalThis as typeof globalThis & { __amysMongo?: MongoCache };

function cache(): MongoCache {
  if (!globalForMongo.__amysMongo) {
    globalForMongo.__amysMongo = { client: null, promise: null };
  }
  return globalForMongo.__amysMongo;
}

export async function getMongoClient() {
  if (!uri) {
    throw new Error("Set MONGODB_URI in .env.local to your MongoDB connection string.");
  }
  const stored = cache();
  if (stored.client) return stored.client;
  if (!stored.promise) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    stored.promise = client.connect().then(
      (connected) => {
        stored.client = connected;
        return connected;
      },
      (error) => {
        stored.promise = null;
        throw error;
      },
    );
  }
  return stored.promise;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(dbName);
}
