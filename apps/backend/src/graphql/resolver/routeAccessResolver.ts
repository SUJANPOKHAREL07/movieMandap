import prisma from '../../prisma/client';

export const routeAccessResolver = {
    Query: {
        getRouteAccess: async () => {
            return await prisma.routeAccess.findMany();
        },
    },
    Mutation: {
        saveRouteAccess: async (_: any, { rules }: { rules: { routeId: string; role: string; allowed: boolean }[] }) => {
            try {
                for (const rule of rules) {
                    await prisma.routeAccess.upsert({
                        where: {
                            routeId_role: {
                                routeId: rule.routeId,
                                role: rule.role as any,
                            },
                        },
                        update: { allowed: rule.allowed },
                        create: {
                            routeId: rule.routeId,
                            role: rule.role as any,
                            allowed: rule.allowed,
                        },
                    });
                }
                return { success: true, message: 'Access rules saved.' };
            } catch (err) {
                return { success: false, message: `Failed to save rules: ${err}` };
            }
        },
    },
};
