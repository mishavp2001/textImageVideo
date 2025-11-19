import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  API: a
    .model({
      name: a.string().required(),
      description: a.string(),
      endpoint_url: a.string().required(),
      method: a.string().default("GET"),
      category: a.string(),
      status: a.string().default("active"),
      free_requests_limit: a.integer().default(100),
      price_per_request: a.float().default(0.01),
      example_request: a.json(),
      example_response: a.json(),
      headers_required: a.string().array(),
      total_requests: a.integer().default(0),
      total_revenue: a.float().default(0),
      apiKeys: a.hasMany("APIKey", "api_id"),
      usages: a.hasMany("APIUsage", "api_id"),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  APIKey: a
    .model({
      api_id: a.id().required(),
      api: a.belongsTo("API", "api_id"),
      key: a.string().required(),
      status: a.string().default("active"),
      requests_made: a.integer().default(0),
      requests_this_month: a.integer().default(0),
      total_spent: a.float().default(0),
      last_used: a.datetime(),
      usages: a.hasMany("APIUsage", "api_key_id"),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  APIUsage: a
    .model({
      api_id: a.id().required(),
      api: a.belongsTo("API", "api_id"),
      api_key_id: a.id().required(),
      apiKey: a.belongsTo("APIKey", "api_key_id"),
      request_method: a.string(),
      request_params: a.json(),
      response_status: a.integer(),
      response_time: a.integer(),
      cost: a.float(),
      timestamp: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
