import mongoose from 'mongoose';

// Define the interface for the cached connection
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global declaration for the cached connection
declare global {
  var mongoose: CachedConnection | undefined;
}

/**
 * MongoDB connection URI from environment variables
 * In production, this should be set in your hosting environment
 * In development, you can use a local MongoDB instance or MongoDB Atlas
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Cached connection object to prevent multiple connections during development
 * This is stored in the global scope to persist across hot reloads
 */
let cached: CachedConnection = global.mongoose || {
  conn: null,
  promise: null,
};

// Set the global cached connection if it doesn't exist
if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB database using Mongoose
 * @returns Promise<typeof mongoose> - Mongoose connection instance
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return existing connection if already established
  if (cached.conn) {
    console.log('Using existing database connection');
    return cached.conn;
  }

  // Create new connection promise if not already in progress
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      // Buffer commands until connection is established
      bufferCommands: false,
      // Maximum time to attempt connection before timing out
      serverSelectionTimeoutMS: 5000,
      // Enable retryable writes for better reliability
      retryWrites: true,
      // Write concern for data durability
      writeConcern: {
        w: 'majority',
        j: true,
      },
    };

    console.log('Creating new database connection...');
    
    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log('Successfully connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        // Reset promise on failure to allow retry
        cached.promise = null;
        throw error;
      });
  }

  try {
    // Wait for connection to establish
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Ensure promise is reset on failure
    cached.promise = null;
    throw error;
  }
}

/**
 * Gracefully close the MongoDB connection
 * Useful for cleanup during application shutdown
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (cached.conn) {
    await cached.conn.connection.close();
    cached.conn = null;
    cached.promise = null;
    console.log('Database connection closed');
  }
}

/**
 * Check if the database connection is active
 * @returns boolean - true if connected, false otherwise
 */
export function isDatabaseConnected(): boolean {
  return cached.conn?.connection.readyState === 1;
}

// Handle process termination for graceful shutdown
process.on('SIGINT', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectFromDatabase();
  process.exit(0);
});
