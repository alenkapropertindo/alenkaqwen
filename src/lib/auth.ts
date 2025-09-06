import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
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
      role: {
        type: "string",
        input: false,
      },
    },
  },
});


export type User = typeof auth.$Infer.Session.user;
