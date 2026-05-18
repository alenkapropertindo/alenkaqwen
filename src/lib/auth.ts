import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  databaseHooks: {
    user: {
      create: {
        before: (user) => {
          const { role, ...rest } = user;
          return {
            data: rest,
          };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      whatsapp: {
        type: "string",
        required: false,
        input: true,
      },
      rekeningNo: {
        type: "string",
        required: false,
        input: true,
      },
      kodeUnik: {
        type: "string",
        required: false,
        input: true,
      },
      affiliateId: {
        type: "string",
        required: false,
        input: true,
      },
      role: {
        type: "string",
        defaultValue: "PENDING",
        input: false,
      },
    },
  },
});


export type User = typeof auth.$Infer.Session.user;
