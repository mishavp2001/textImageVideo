/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAPI = /* GraphQL */ `
  mutation CreateAPI(
    $condition: ModelAPIConditionInput
    $input: CreateAPIInput!
  ) {
    createAPI(condition: $condition, input: $input) {
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
      owner_id
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
export const createAPIKey = /* GraphQL */ `
  mutation CreateAPIKey(
    $condition: ModelAPIKeyConditionInput
    $input: CreateAPIKeyInput!
  ) {
    createAPIKey(condition: $condition, input: $input) {
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
        owner_id
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
      user {
        createdAt
        credit_card_last4
        email
        id
        owner
        payment_method_id
        stripe_customer_id
        total_spent
        updatedAt
        __typename
      }
      user_email
      user_id
      __typename
    }
  }
`;
export const createAPIUsage = /* GraphQL */ `
  mutation CreateAPIUsage(
    $condition: ModelAPIUsageConditionInput
    $input: CreateAPIUsageInput!
  ) {
    createAPIUsage(condition: $condition, input: $input) {
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
        owner_id
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
        user_email
        user_id
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
export const createAPIUser = /* GraphQL */ `
  mutation CreateAPIUser(
    $condition: ModelAPIUserConditionInput
    $input: CreateAPIUserInput!
  ) {
    createAPIUser(condition: $condition, input: $input) {
      apiKeys {
        nextToken
        __typename
      }
      createdAt
      credit_card_last4
      email
      id
      owner
      payment_method_id
      stripe_customer_id
      total_spent
      updatedAt
      __typename
    }
  }
`;
export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $condition: ModelTodoConditionInput
    $input: CreateTodoInput!
  ) {
    createTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
export const deleteAPI = /* GraphQL */ `
  mutation DeleteAPI(
    $condition: ModelAPIConditionInput
    $input: DeleteAPIInput!
  ) {
    deleteAPI(condition: $condition, input: $input) {
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
      owner_id
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
export const deleteAPIKey = /* GraphQL */ `
  mutation DeleteAPIKey(
    $condition: ModelAPIKeyConditionInput
    $input: DeleteAPIKeyInput!
  ) {
    deleteAPIKey(condition: $condition, input: $input) {
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
        owner_id
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
      user {
        createdAt
        credit_card_last4
        email
        id
        owner
        payment_method_id
        stripe_customer_id
        total_spent
        updatedAt
        __typename
      }
      user_email
      user_id
      __typename
    }
  }
`;
export const deleteAPIUsage = /* GraphQL */ `
  mutation DeleteAPIUsage(
    $condition: ModelAPIUsageConditionInput
    $input: DeleteAPIUsageInput!
  ) {
    deleteAPIUsage(condition: $condition, input: $input) {
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
        owner_id
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
        user_email
        user_id
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
export const deleteAPIUser = /* GraphQL */ `
  mutation DeleteAPIUser(
    $condition: ModelAPIUserConditionInput
    $input: DeleteAPIUserInput!
  ) {
    deleteAPIUser(condition: $condition, input: $input) {
      apiKeys {
        nextToken
        __typename
      }
      createdAt
      credit_card_last4
      email
      id
      owner
      payment_method_id
      stripe_customer_id
      total_spent
      updatedAt
      __typename
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $condition: ModelTodoConditionInput
    $input: DeleteTodoInput!
  ) {
    deleteTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
export const updateAPI = /* GraphQL */ `
  mutation UpdateAPI(
    $condition: ModelAPIConditionInput
    $input: UpdateAPIInput!
  ) {
    updateAPI(condition: $condition, input: $input) {
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
      owner_id
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
export const updateAPIKey = /* GraphQL */ `
  mutation UpdateAPIKey(
    $condition: ModelAPIKeyConditionInput
    $input: UpdateAPIKeyInput!
  ) {
    updateAPIKey(condition: $condition, input: $input) {
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
        owner_id
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
      user {
        createdAt
        credit_card_last4
        email
        id
        owner
        payment_method_id
        stripe_customer_id
        total_spent
        updatedAt
        __typename
      }
      user_email
      user_id
      __typename
    }
  }
`;
export const updateAPIUsage = /* GraphQL */ `
  mutation UpdateAPIUsage(
    $condition: ModelAPIUsageConditionInput
    $input: UpdateAPIUsageInput!
  ) {
    updateAPIUsage(condition: $condition, input: $input) {
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
        owner_id
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
        user_email
        user_id
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
export const updateAPIUser = /* GraphQL */ `
  mutation UpdateAPIUser(
    $condition: ModelAPIUserConditionInput
    $input: UpdateAPIUserInput!
  ) {
    updateAPIUser(condition: $condition, input: $input) {
      apiKeys {
        nextToken
        __typename
      }
      createdAt
      credit_card_last4
      email
      id
      owner
      payment_method_id
      stripe_customer_id
      total_spent
      updatedAt
      __typename
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $condition: ModelTodoConditionInput
    $input: UpdateTodoInput!
  ) {
    updateTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      updatedAt
      __typename
    }
  }
`;
