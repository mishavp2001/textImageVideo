import React from 'react';
import { FileText, Code, CheckCircle } from 'lucide-react';

export default function APIDocumentation({ api }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        Documentation
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Endpoint
          </h4>
          <div className="bg-slate-900 rounded-xl p-4">
            <code className="text-green-400 text-sm">
              {api.method} {api.endpoint_url}
            </code>
          </div>
        </div>

        {api.example_request && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Example Request</h4>
            <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto text-sm">
              {api.example_request}
            </pre>
          </div>
        )}

        {api.example_response && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Example Response</h4>
            <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto text-sm">
              {api.example_response}
            </pre>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Authentication
          </h4>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-slate-700 mb-2">
              Include your API key in the request header:
            </p>
            <code className="block bg-slate-900 text-green-400 rounded-lg p-3 text-xs">
              X-API-Key: your_api_key_here
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}