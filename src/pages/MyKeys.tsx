import React from "react";
import { apiClient } from "@/lib/amplify-client";
import { useQuery } from "@tanstack/react-query";
import { Key, Search } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

import APIKeyCard from "../components/my-keys/APIKeyCard";

export default function MyKeys() {
  const { user } = useAuth();

  const { data: apiKeys = [], isLoading } = useQuery({
    queryKey: ['myKeys', user?.userId],
    queryFn: async () => {
      if (!user) return [];
      const keys = await apiClient.apiKeys.list();
      // Filter by current user - you may need to adjust this based on your schema
      return keys;
    },
    enabled: !!user,
  });

  const { data: apis = [] } = useQuery({
    queryKey: ['apisForKeys'],
    queryFn: () => apiClient.apis.list(),
  });

  const keysWithAPIInfo = apiKeys.map(key => ({
    ...key,
    api: apis.find(api => api.id === key.api_id)
  }));

  const totalSpent = apiKeys.reduce((sum, key) => sum + (key.total_spent || 0), 0) || 0;
  const totalRequests = apiKeys.reduce((sum, key) => sum + (key.requests_made || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My API Keys</h1>
          <p className="text-slate-600">Manage your subscriptions and API access</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Active Keys</p>
                <p className="text-3xl font-bold text-slate-900">
                  {keysWithAPIInfo.filter(k => k.status === 'active').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50">
                <Key className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Total Requests</p>
                <p className="text-3xl font-bold text-slate-900">{totalRequests.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Total Spent</p>
                <p className="text-3xl font-bold text-slate-900">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <Search className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : keysWithAPIInfo.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No API Keys Yet</h3>
            <p className="text-slate-600">Browse available APIs and generate keys to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {keysWithAPIInfo.map((keyData) => (
              <APIKeyCard key={keyData.id} keyData={keyData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}