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
  apiUsers: {
    list: async () => {
      const result: any = await getClient().graphql({
        query: queries.listAPIUsers,
      });
      return result.data?.listAPIUsers?.items || [];
    },
    get: async (id: string) => {
      const result: any = await getClient().graphql({
        query: queries.getAPIUser,
        variables: { id },
      });
      return result.data?.getAPIUser;
    },
    getByEmail: async (email: string) => {
      const result: any = await getClient().graphql({
        query: queries.listAPIUsers,
        variables: {
          filter: {
            email: { eq: email }
          }
        },
      });
      const items = result.data?.listAPIUsers?.items || [];
      return items.length > 0 ? items[0] : null;
    },
    create: async (data: any) => {
      const result: any = await getClient().graphql({
        query: mutations.createAPIUser,
        variables: { input: data },
      });
      return result.data?.createAPIUser;
    },
    update: async (id: string, data: any) => {
      const result: any = await getClient().graphql({
        query: mutations.updateAPIUser,
        variables: { input: { id, ...data } },
      });
      return result.data?.updateAPIUser;
    },
  },
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
    getByName: async (name: string) => {
      const result: any = await getClient().graphql({
        query: queries.listAPIS,
        variables: {
          filter: {
            name: { eq: name }
          }
        },
      });
      const items = result.data?.listAPIS?.items || [];
      return items.length > 0 ? items[0] : null;
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
      // Use a custom mutation that doesn't fetch the user relationship
      // to avoid null errors when user relationship isn't established yet
      const customCreateAPIKey = /* GraphQL */ `
        mutation CreateAPIKey(
          $condition: ModelAPIKeyConditionInput
          $input: CreateAPIKeyInput!
        ) {
          createAPIKey(condition: $condition, input: $input) {
            api_id
            createdAt
            id
            key
            last_used
            requests_made
            requests_this_month
            status
            total_spent
            updatedAt
            user_email
            user_id
            __typename
          }
        }
      `;

      const result: any = await getClient().graphql({
        query: customCreateAPIKey,
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

