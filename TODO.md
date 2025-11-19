1. Add amplify DATA recporces
    1.1 API
        name
        Name of the API
        description
        Detailed description of what the API does
        endpoint_url
        The actual API endpoint URL
        method
        HTTP method
        GET
        category
        API category
        status
        API status
        active
        free_requests_limit
        Number of free requests per month
        100
        price_per_request
        Price per request in USD after free tier
        0.01
        example_request
        Example request body or parameters
        example_response
        Example response
        headers_required
        Required headers for the API
        Add Item
        total_requests
        Total number of requests made
        total_revenue
        Total revenue generated
    1.2 APIKey
        api_id
        Reference to the API entity
        key
        The generated API key
        status
        Key status
        active
        requests_made
        Total requests made with this key
        requests_this_month
        Requests made this month
        total_spent
        Total amount spent
        last_used
        Last time the key was used

    1.3 APIUsage
        api_id
        Reference to the API
        api_key_id
        Reference to the API key used
        request_method
        HTTP method used
        request_params
        Request parameters
        response_status
        HTTP response status code
        response_time
        Response time in milliseconds
        cost
        Cost of this request
        timestamp
        When the request was made


