// @ts-nocheck
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/amplify-client";

export default function APITester({ api, apiKey }) {
  const [requestBody, setRequestBody] = useState(
    api.example_request
      ? (typeof api.example_request === 'string' ? api.example_request : JSON.stringify(api.example_request, null, 2))
      : ''
  );
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const testAPI = async () => {
    if (!apiKey) {
      toast.error("Please generate an API key first");
      return;
    }

    // Validate that apiKey has the required properties
    if (!apiKey.key || !apiKey.id) {
      toast.error("Invalid API key object");
      console.error('APIKey object:', apiKey);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    const startTime = Date.now();

    try {
      // Parse request body if it's JSON
      let parsedBody = null;
      let queryParams = '';

      if (requestBody && requestBody.trim()) {
        if (api.method === 'GET') {
          // For GET requests, treat as query parameters
          queryParams = requestBody.startsWith('?') ? requestBody : `?${requestBody}`;
        } else {
          // For other methods, parse as JSON
          try {
            parsedBody = JSON.parse(requestBody);
          } catch (e) {
            throw new Error('Invalid JSON in request body');
          }
        }
      }

      // Build the full URL
      const fullUrl = api.endpoint_url + queryParams;

      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey.key, // Use the generated API key
      };

      // Add any required headers from the API configuration
      if (api.headers_required && Array.isArray(api.headers_required)) {
        api.headers_required.forEach(header => {
          if (header && !headers[header]) {
            headers[header] = ''; // Placeholder for required headers
          }
        });
      }

      // Make the actual API request
      const fetchOptions = {
        method: api.method || 'GET',
        headers,
      };

      // Add body for non-GET requests
      if (parsedBody && api.method !== 'GET') {
        fetchOptions.body = JSON.stringify(parsedBody);
      }

      const apiResponse = await fetch(fullUrl, fetchOptions);
      const responseTime = Date.now() - startTime;

      // Parse response
      let responseData;
      const contentType = apiResponse.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await apiResponse.json();
      } else {
        responseData = await apiResponse.text();
      }

      // Calculate cost
      const cost = api.price_per_request || 0;

      // Record usage in database
      try {
        await apiClient.usage.create({
          api_id: api.id,
          api_key_id: apiKey.id,
          request_method: api.method,
          request_params: parsedBody || queryParams,
          response_status: apiResponse.status,
          response_time: responseTime,
          cost: cost,
          timestamp: new Date().toISOString(),
        });

        // Update API key statistics
        await apiClient.apiKeys.update(apiKey.id, {
          requests_made: (apiKey.requests_made || 0) + 1,
          requests_this_month: (apiKey.requests_this_month || 0) + 1,
          total_spent: (apiKey.total_spent || 0) + cost,
          last_used: new Date().toISOString(),
        });

        // Update API statistics
        await apiClient.apis.update(api.id, {
          total_requests: (api.total_requests || 0) + 1,
          total_revenue: (api.total_revenue || 0) + cost,
        });
      } catch (usageError) {
        console.error('Error recording usage:', usageError);
        // Don't fail the request if usage tracking fails
      }

      setResponse({
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        data: responseData,
        responseTime: responseTime,
        timestamp: new Date().toISOString(),
        cost: cost,
      });

      if (apiResponse.ok) {
        toast.success(`API request successful! (${responseTime}ms)`);
      } else {
        toast.warning(`API returned status ${apiResponse.status}`);
      }
    } catch (err) {
      const responseTime = Date.now() - startTime;
      let errorMessage = err.message || 'Request failed';

      // Check for CORS error
      if (err.message && err.message.includes('Failed to fetch')) {
        errorMessage = 'CORS Error: The API does not allow requests from this origin. In production, use a backend proxy to make API requests.';
      } else if (err.message && err.message.includes('NetworkError')) {
        errorMessage = 'Network Error: Unable to reach the API endpoint. Check if the URL is correct and the API is accessible.';
      }

      setError(errorMessage);
      toast.error(`API request failed: ${errorMessage}`);

      // Record failed request
      try {
        await apiClient.usage.create({
          api_id: api.id,
          api_key_id: apiKey.id,
          request_method: api.method,
          request_params: requestBody,
          response_status: 0,
          response_time: responseTime,
          cost: 0,
          timestamp: new Date().toISOString(),
        });
      } catch (usageError) {
        console.error('Error recording failed usage:', usageError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Play className="w-5 h-5 text-green-600" />
        API Playground
      </h3>

      {!apiKey && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            Generate an API key to test this endpoint
          </div>
        </div>
      )}

      {apiKey && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Note:</strong> Some APIs may block requests from browsers due to CORS policies.
            If you encounter CORS errors, the API works but requires a backend proxy in production.
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">
            Request Body {api.method !== 'GET' && '(JSON)'}
          </label>
          <Textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            placeholder={api.method === 'GET' ? 'Query parameters (optional)' : 'Enter request body in JSON format'}
            rows={6}
            className="font-mono text-sm"
          />
        </div>

        <Button
          onClick={testAPI}
          disabled={isLoading || !apiKey}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending Request...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Test API
            </>
          )}
        </Button>

        {response && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-sm font-semibold text-slate-700">Response</h4>
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <span className={`px-3 py-1 rounded-full font-semibold ${
                  response.status < 300 ? 'bg-green-100 text-green-700' :
                  response.status < 400 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {response.status} {response.statusText}
                </span>
                <span className="text-slate-600 font-medium">
                  ⚡ {response.responseTime}ms
                </span>
                {response.cost > 0 && (
                  <span className="text-purple-600 font-medium">
                    💰 ${response.cost.toFixed(4)}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm">
                {typeof response.data === 'string'
                  ? response.data
                  : JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
            <div className="text-xs text-slate-500">
              Timestamp: {new Date(response.timestamp).toLocaleString()}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">{error}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}