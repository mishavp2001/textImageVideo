import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import * as mutations from "../../ui-components/graphql/mutations";
import * as queries from "../../ui-components/graphql/queries";

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
      const result: any = await getClient().graphql({
        query: queries.listAPIS,
      });
      return result.data?.listAPIS?.items || [];
    },
    get: async (id: string) => {
      const result: any = await getClient().graphql({
        query: queries.getAPI,
        variables: { id },
      });
      return result.data?.getAPI;
    },
    create: async (data: any) => {
      // Stringify JSON fields for GraphQL
      const input = {
        ...data,
        example_request: data.example_request ? JSON.stringify(data.example_request) : null,
        example_response: data.example_response ? JSON.stringify(data.example_response) : null,
      };
      const result: any = await getClient().graphql({
        query: mutations.createAPI,
        variables: { input },
      });
      return result.data?.createAPI;
    },
    update: async (id: string, data: any) => {
      // Stringify JSON fields for GraphQL
      const input = {
        id,
        ...data,
        example_request: data.example_request ? JSON.stringify(data.example_request) : undefined,
        example_response: data.example_response ? JSON.stringify(data.example_response) : undefined,
      };
      const result: any = await getClient().graphql({
        query: mutations.updateAPI,
        variables: { input },
      });
      return result.data?.updateAPI;
    },
    delete: async (id: string) => {
      const result: any = await getClient().graphql({
        query: mutations.deleteAPI,
        variables: { input: { id } },
      });
      return result.data?.deleteAPI;
    },
  },
  apiKeys: {
    list: async () => {
      const result: any = await getClient().graphql({
        query: queries.listAPIKeys,
      });
      return result.data?.listAPIKeys?.items || [];
    },
    get: async (id: string) => {
      const result: any = await getClient().graphql({
        query: queries.getAPIKey,
        variables: { id },
      });
      return result.data?.getAPIKey;
    },
    create: async (data: any) => {
      const result: any = await getClient().graphql({
        query: mutations.createAPIKey,
        variables: { input: data },
      });
      return result.data?.createAPIKey;
    },
    update: async (id: string, data: any) => {
      const result: any = await getClient().graphql({
        query: mutations.updateAPIKey,
        variables: { input: { id, ...data } },
      });
      return result.data?.updateAPIKey;
    },
    delete: async (id: string) => {
      const result: any = await getClient().graphql({
        query: mutations.deleteAPIKey,
        variables: { input: { id } },
      });
      return result.data?.deleteAPIKey;
    },
  },
  usage: {
    list: async () => {
      const result: any = await getClient().graphql({
        query: queries.listAPIUsages,
      });
      return result.data?.listAPIUsages?.items || [];
    },
    create: async (data: any) => {
      // Stringify JSON fields for GraphQL
      const input = {
        ...data,
        request_params: data.request_params ? JSON.stringify(data.request_params) : null,
      };
      const result: any = await getClient().graphql({
        query: mutations.createAPIUsage,
        variables: { input },
      });
      return result.data?.createAPIUsage;
    },
  },
};

