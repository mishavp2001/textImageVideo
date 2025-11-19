/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAPI = /* GraphQL */ `
  query GetAPI($id: ID!) {
    getAPI(id: $id) {
      apiKeys {
        nextToken
        __typename
      }
      category
      createdAt
      description
      endpoint_url
      example_request
      example_response
      free_requests_limit
      headers_required
      id
      method
      name
      price_per_request
      status
      total_requests
      total_revenue
      updatedAt
      usages {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const getAPIKey = /* GraphQL */ `
  query GetAPIKey($id: ID!) {
    getAPIKey(id: $id) {
      api {
        category
        createdAt
        description
        endpoint_url
        example_request
        example_response
        free_requests_limit
        headers_required
        id
        method
        name
        price_per_request
        status
        total_requests
        total_revenue
        updatedAt
        __typename
      }
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
      usages {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const getAPIUsage = /* GraphQL */ `
  query GetAPIUsage($id: ID!) {
    getAPIUsage(id: $id) {
      api {
        category
        createdAt
        description
        endpoint_url
        example_request
        example_response
        free_requests_limit
        headers_required
        id
        method
        name
        price_per_request
        status
        total_requests
        total_revenue
        updatedAt
        __typename
      }
      apiKey {
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
        __typename
      }
      api_id
      api_key_id
      cost
      createdAt
      id
      request_method
      request_params
      response_status
      response_time
      timestamp
      updatedAt
      __typename
    }
  }
`;
export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
export const listAPIKeys = /* GraphQL */ `
  query ListAPIKeys(
    $filter: ModelAPIKeyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAPIKeys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listAPIS = /* GraphQL */ `
  query ListAPIS(
    $filter: ModelAPIFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAPIS(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        category
        createdAt
        description
        endpoint_url
        example_request
        example_response
        free_requests_limit
        headers_required
        id
        method
        name
        price_per_request
        status
        total_requests
        total_revenue
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listAPIUsages = /* GraphQL */ `
  query ListAPIUsages(
    $filter: ModelAPIUsageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAPIUsages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        api_id
        api_key_id
        cost
        createdAt
        id
        request_method
        request_params
        response_status
        response_time
        timestamp
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        content
        createdAt
        id
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
