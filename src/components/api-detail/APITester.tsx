// @ts-nocheck
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function APITester({ api, apiKey }) {
  const [requestBody, setRequestBody] = useState(api.example_request || '');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const testAPI = async () => {
    if (!apiKey) {
      toast.error("Please generate an API key first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const startTime = Date.now();
      
      // Simulated proxy request - in production this would go through your backend
      // This is a mock implementation for demonstration
      const mockResponse = {
        status: 200,
        data: api.example_response ? JSON.parse(api.example_response) : { success: true, message: "API call successful" },
        responseTime: Math.random() * 500 + 100
      };

      await new Promise(resolve => setTimeout(resolve, mockResponse.responseTime));

      setResponse({
        status: mockResponse.status,
        data: mockResponse.data,
        responseTime: Math.round(mockResponse.responseTime),
        timestamp: new Date().toISOString()
      });

      toast.success("API request successful!");
    } catch (err) {
      setError(err.message);
      toast.error("API request failed");
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
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-700">Response</h4>
              <div className="flex items-center gap-4 text-xs">
                <span className={`px-3 py-1 rounded-full font-semibold ${
                  response.status < 300 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  Status: {response.status}
                </span>
                <span className="text-slate-600">
                  {response.responseTime}ms
                </span>
              </div>
            </div>
            <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto text-sm">
              {JSON.stringify(response.data, null, 2)}
            </pre>
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