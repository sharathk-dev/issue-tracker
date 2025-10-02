import { PrismaClient } from '@prisma/client';

const prismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClient>;
}

const prisma = globalThis.prismaGlobal ?? prismaClient();

export { prisma };

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
