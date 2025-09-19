import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { typeDefs } from './graphql/schema/schema';
import { resolvers } from './graphql/resolver/resolver';
import cors from 'cors';

const app = express();

app.use(cookieParser());
app.use(
  session({
    secret: process.env.JWT_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10 * 60 * 1000, httpOnly: true }, // 10 min
  })
);
app.use(
  cors({
    origin: 'https://studio.apollographql.com',
    credentials: true,
  })
);
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
  });

  await server.start();
  server.applyMiddleware({
    app: app as any,
    cors: { origin: true, credentials: true },
    path: '/graphql',
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();
