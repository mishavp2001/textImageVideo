/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAPI = /* GraphQL */ `
  subscription OnCreateAPI($filter: ModelSubscriptionAPIFilterInput) {
    onCreateAPI(filter: $filter) {
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
export const onCreateAPIKey = /* GraphQL */ `
  subscription OnCreateAPIKey($filter: ModelSubscriptionAPIKeyFilterInput) {
    onCreateAPIKey(filter: $filter) {
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
export const onCreateAPIUsage = /* GraphQL */ `
  subscription OnCreateAPIUsage($filter: ModelSubscriptionAPIUsageFilterInput) {
    onCreateAPIUsage(filter: $filter) {
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
export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onCreateTodo(filter: $filter) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
export const onDeleteAPI = /* GraphQL */ `
  subscription OnDeleteAPI($filter: ModelSubscriptionAPIFilterInput) {
    onDeleteAPI(filter: $filter) {
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
export const onDeleteAPIKey = /* GraphQL */ `
  subscription OnDeleteAPIKey($filter: ModelSubscriptionAPIKeyFilterInput) {
    onDeleteAPIKey(filter: $filter) {
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
export const onDeleteAPIUsage = /* GraphQL */ `
  subscription OnDeleteAPIUsage($filter: ModelSubscriptionAPIUsageFilterInput) {
    onDeleteAPIUsage(filter: $filter) {
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
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo($filter: ModelSubscriptionTodoFilterInput) {
    onDeleteTodo(filter: $filter) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
export const onUpdateAPI = /* GraphQL */ `
  subscription OnUpdateAPI($filter: ModelSubscriptionAPIFilterInput) {
    onUpdateAPI(filter: $filter) {
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
export const onUpdateAPIKey = /* GraphQL */ `
  subscription OnUpdateAPIKey($filter: ModelSubscriptionAPIKeyFilterInput) {
    onUpdateAPIKey(filter: $filter) {
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
export const onUpdateAPIUsage = /* GraphQL */ `
  subscription OnUpdateAPIUsage($filter: ModelSubscriptionAPIUsageFilterInput) {
    onUpdateAPIUsage(filter: $filter) {
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
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo($filter: ModelSubscriptionTodoFilterInput) {
    onUpdateTodo(filter: $filter) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
