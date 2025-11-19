// @ts-nocheck
import React from "react";
import { apiClient } from "@/lib/amplify-client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Activity, DollarSign, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Analytics() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const apiId = urlParams.get('id');

  const { data: api, isLoading: apiLoading } = useQuery({
    queryKey: ['api', apiId],
    queryFn: async () => {
      if (!apiId) return null;
      return await apiClient.apis.get(apiId);
    },
    enabled: !!apiId,
  });

  const { data: usage = [] } = useQuery({
    queryKey: ['usage', apiId],
    queryFn: async () => {
      const allUsage = await apiClient.usage.list();
      return allUsage.filter((u: any) => u.api_id === apiId);
    },
    enabled: !!apiId,
  });

  // Mock data for demo purposes
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      requests: Math.floor(Math.random() * 100) + 20,
      revenue: (Math.random() * 5).toFixed(2)
    };
  });

  const statusDistribution = [
    { name: '200 OK', value: 85, color: '#10b981' },
    { name: '400 Error', value: 10, color: '#f59e0b' },
    { name: '500 Error', value: 5, color: '#ef4444' }
  ];

  if (apiLoading || !api) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("MyAPIs"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My APIs
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{api.name} Analytics</h1>
          <p className="text-slate-600">Performance metrics and usage statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Total Requests</p>
                <p className="text-3xl font-bold text-slate-900">
                  {api.total_requests?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last month
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-slate-900">
                  ${(api.total_revenue || 0).toFixed(2)}
                </p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% from last month
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Avg Response Time</p>
                <p className="text-3xl font-bold text-slate-900">245ms</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  -15% faster
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium mb-2">Active Users</p>
                <p className="text-3xl font-bold text-slate-900">24</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +3 new users
                </p>
              </div>
              <div className="p-3 rounded-xl bg-orange-50">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Requests Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={last7Days}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="requests" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRequests)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Response Status Distribution</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {statusDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-700">{item.name}</span>
                  <span className="text-sm font-semibold text-slate-900 ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}