/**
 * AWS Lambda Proxy Function for API Testing
 * 
 * This function acts as a CORS-enabled proxy to forward API requests
 * from the frontend to target APIs that don't support CORS.
 * 
 * Deploy this to AWS Lambda and expose via API Gateway with CORS enabled.
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

exports.handler = async (event) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  // Handle OPTIONS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    // Parse request body
    const body = event.body ? JSON.parse(event.body) : {};
    const { url, method, headers, requestBody } = body;

    // Validate required fields
    if (!url) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing required field: url' }),
      };
    }

    // Make the proxied request
    const response = await makeRequest(url, method || 'GET', headers || {}, requestBody);

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: response.statusCode,
        statusText: response.statusMessage,
        headers: response.headers,
        data: response.body,
        responseTime: response.responseTime,
      }),
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: error.message,
        details: error.stack,
      }),
    };
  }
};

/**
 * Make HTTP/HTTPS request to target API
 */
function makeRequest(urlString, method, headers, body) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const parsedUrl = new URL(urlString);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        ...headers,
        'Content-Type': headers['Content-Type'] || 'application/json',
      },
    };

    const req = protocol.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        
        // Try to parse as JSON, fallback to text
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          parsedData = data;
        }

        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          body: parsedData,
          responseTime,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    // Send request body if present
    if (body && method !== 'GET') {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }

    req.end();
  });
}

