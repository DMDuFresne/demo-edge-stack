import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { typeDefs } from './types/schema';
import { resolvers } from './resolvers';
import { pool } from './db/pool';

const app = express();
const port = parseInt(process.env.PORT || '4000');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError, error) => {
    console.error('GraphQL Error:', error);
    return formattedError;
  },
  introspection: true,
  // Enable Apollo Studio Sandbox (GraphQL IDE)
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({
      embed: true,
      includeCookies: true,
    }),
  ],
});

async function startServer() {
  try {
    // Test database connection
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();

    // Start Apollo Server
    await server.start();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // GraphQL endpoint
    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async () => ({
          pool,
        }),
      })
    );

    // Health check endpoint
    app.get('/health', (_req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Root endpoint
    app.get('/', (_req, res) => {
      res.redirect('/graphql');
    });

    app.listen(port, () => {
      console.log(`🚀 GraphQL Server ready at http://localhost:${port}/graphql`);
      console.log(`🎨 Apollo Studio Sandbox available at http://localhost:${port}/graphql`);
      console.log(`💚 Health check available at http://localhost:${port}/health`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await pool.end();
  process.exit(0);
});

startServer();
