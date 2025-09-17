import prisma from '../prisma/client';

export const resolvers = {
  Query: {
    users: async () => {
      return prisma.user.findMany();
    },
  },
};
