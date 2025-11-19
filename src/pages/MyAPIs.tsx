import React, { useState } from "react";
import { apiClient } from "@/lib/amplify-client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, DollarSign, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";

import PublishAPIDialog from "../components/browse/PublishAPIDialog";
import MyAPICard from "../components/my-apis/MyAPICard";

export default function MyAPIs() {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const { user } = useAuth();

  const { data: apis = [], isLoading } = useQuery({
    queryKey: ['myAPIs', user?.userId],
    queryFn: async () => {
      if (!user) return [];
      const allAPIs = await apiClient.apis.list();
      // Filter by current user - you may need to adjust this based on your schema
      return allAPIs;
    },
    enabled: !!user,
  });

  const totalRequests = apis.reduce((sum, api) => sum + (api.total_requests || 0), 0) || 0;
  const totalRevenue = apis.reduce((sum, api) => sum + (api.total_revenue || 0), 0) || 0;
  const activeAPIs = apis.filter(api => api.status === 'active').length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Published APIs</h1>
            <p className="text-slate-600">Manage your APIs and track their performance</p>
          </div>
          <Button
            onClick={() => setShowPublishDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-5 h-5 mr-2" />
            Publish New API
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-slate-900">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Total Requests</p>
                <p className="text-3xl font-bold text-slate-900">{totalRequests.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Active APIs</p>
                <p className="text-3xl font-bold text-slate-900">{activeAPIs}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : apis.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No APIs Published Yet</h3>
            <p className="text-slate-600 mb-6">Start sharing your APIs with the community</p>
            <Button onClick={() => setShowPublishDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Publish Your First API
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apis.map((api) => (
              <MyAPICard key={api.id} api={api} />
            ))}
          </div>
        )}

        <PublishAPIDialog 
          open={showPublishDialog} 
          onOpenChange={setShowPublishDialog}
        />
      </div>
    </div>
  );
}