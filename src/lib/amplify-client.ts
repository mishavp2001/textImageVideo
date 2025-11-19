import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

// Lazy initialization to ensure Amplify is configured first
let amplifyClient: ReturnType<typeof generateClient<Schema>> | null = null;

const getClient = () => {
  if (!amplifyClient) {
    amplifyClient = generateClient<Schema>();
  }
  return amplifyClient;
};

// Helper functions to match the Base44 SDK API structure
export const apiClient = {
  apis: {
    list: async () => {
      const result = await getClient().models.API.list();
      return result.data || [];
    },
    get: async (id: string) => {
      const result = await getClient().models.API.get({ id });
      return result.data;
    },
    create: async (data: any) => {
      const result = await getClient().models.API.create(data);
      return result.data;
    },
    update: async (id: string, data: any) => {
      const result = await getClient().models.API.update({ id, ...data });
      return result.data;
    },
    delete: async (id: string) => {
      const result = await getClient().models.API.delete({ id });
      return result.data;
    },
  },
  apiKeys: {
    list: async () => {
      const result = await getClient().models.APIKey.list();
      return result.data || [];
    },
    get: async (id: string) => {
      const result = await getClient().models.APIKey.get({ id });
      return result.data;
    },
    create: async (data: any) => {
      const result = await getClient().models.APIKey.create(data);
      return result.data;
    },
    update: async (id: string, data: any) => {
      const result = await getClient().models.APIKey.update({ id, ...data });
      return result.data;
    },
    delete: async (id: string) => {
      const result = await getClient().models.APIKey.delete({ id });
      return result.data;
    },
  },
  usage: {
    list: async () => {
      const result = await getClient().models.APIUsage.list();
      return result.data || [];
    },
    create: async (data: any) => {
      const result = await getClient().models.APIUsage.create(data);
      return result.data;
    },
  },
};

