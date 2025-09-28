import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { typeDefs } from './graphql/schema/schema';
import { resolvers } from './graphql/resolver/resolver';
import cors from 'cors';
import { TReqRes } from './types/user.types';
import { authContextMiddleware } from './authMiddleware/authMiddleware';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import path from 'path';
// import { JWT } from './authMiddleware/jwtToken';

const app = express();
app.use(graphqlUploadExpress());
app.use(cookieParser());
// app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRETE || 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 15 * 60 * 1000, httpOnly: true }, // 15 min
  })
);
app.use(
  cors({
    origin: 'https://studio.apollographql.com',
    credentials: true,
  })
);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
async function startServer() {
  const server = new ApolloServer(
    {
      typeDefs,
      resolvers,
      context: async ({ req, res }: TReqRes) => {
        const auth = await authContextMiddleware({ req, res });
        return {
          req,
          res,
          user: auth.user,
          token: auth.token,
        };
      },
    }
    // @ts-ignore
    //   context: async ({ req, res }: TReqRes) => {
    //     session: req.session;
    //     const token = await req.headers['refresh_token'];
    //     if (!token) {
    //       return {
    //         message: 'Login first',
    //       };
    //     }
    //     try {
    //       const user = await JWT.verifyRefreshToken(token as string);

    //       return { user, token };
    //     } catch (err) {}
    //   },
  );

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
