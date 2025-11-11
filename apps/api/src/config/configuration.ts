export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  solana: {
    network: process.env.SOLANA_NETWORK || 'mainnet-beta',
    rpcUrl: process.env.SOLANA_RPC_URL || null,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10) || 300,
    maxItems: parseInt(process.env.CACHE_MAX_ITEMS, 10) || 100,
  },
});
