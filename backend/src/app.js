import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { typeDefs, resolvers } from './graphql/index.js'
import { optionalAuth } from './middleware/jwt.js'

/**
 * Express application configuration
 * Sets up middleware, GraphQL server, and REST API routes
 */
const app = express()

// Enable CORS for cross-origin requests from frontend
app.use(cors())

// Parse JSON request bodies
app.use(bodyParser.json())

// Initialize Apollo Server for GraphQL API
const apolloServer = new ApolloServer({
  typeDefs, // GraphQL schema definitions
  resolvers, // Query and mutation resolvers
})

// Start Apollo Server and mount it on /graphql endpoint
apolloServer.start().then(() =>
  app.use(
    '/graphql',
    optionalAuth, // Middleware to parse JWT token if present
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        // Pass auth info and Socket.IO instance to GraphQL resolvers
        return { auth: req.auth, io: req.app.get('io') }
      },
    }),
  ),
)

// Register REST API route handlers
postsRoutes(app) // /api/v1/posts endpoints
userRoutes(app) // /api/v1/users endpoints
eventRoutes(app) // /api/v1/events endpoints

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello World from Express!')
})

export { app }
