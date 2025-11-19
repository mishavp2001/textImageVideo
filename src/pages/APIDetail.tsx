// @ts-nocheck
import React, { useState } from "react";
import { apiClient } from "@/lib/amplify-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Key, Play, Copy, Check, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

import APITester from "../components/api-detail/APITester";
import PricingDisplay from "../components/api-detail/PricingDisplay";
import APIDocumentation from "../components/api-detail/APIDocumentation";

export default function APIDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const apiId = urlParams.get('id');
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: api, isLoading } = useQuery({
    queryKey: ['api', apiId],
    queryFn: async () => {
      if (!apiId) return null;
      return await apiClient.apis.get(apiId);
    },
    enabled: !!apiId,
  });

  const { data: apiKeys = [] } = useQuery({
    queryKey: ['apiKeys', apiId, user?.userId],
    queryFn: async () => {
      if (!user) return [];
      const keys = await apiClient.apiKeys.list();
      return keys.filter((k: any) => k.api_id === apiId && k.created_by === user.username);
    },
    enabled: !!apiId && !!user,
  });

  const generateKeyMutation = useMutation({
    mutationFn: async () => {
      const randomKey = `apihub_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      return apiClient.apiKeys.create({
        api_id: apiId,
        key: randomKey,
        status: 'active',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys', apiId] });
      toast.success("API Key generated successfully!");
    },
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!api) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">API Not Found</h2>
          <p className="text-slate-600 mb-6">The API you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(createPageUrl("Browse"))}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  const activeKey = apiKeys?.find(k => k.status === 'active');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Browse"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold text-slate-900">{api.name}</h1>
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {api.method}
                </Badge>
                <Badge variant="outline" className="border-slate-300">
                  {api.category}
                </Badge>
              </div>
              <p className="text-slate-600 text-lg mb-4">{api.description}</p>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>Published by {api.created_by?.split('@')[0]}</span>
                <span>•</span>
                <span>{api.total_requests?.toLocaleString() || 0} requests served</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm text-slate-700">
                {api.endpoint_url}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(api.endpoint_url)}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <PricingDisplay api={api} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <APIDocumentation api={api} />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                Your API Key
              </h3>
              
              {activeKey ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="text-xs text-slate-500 mb-2">Active Key</div>
                    <div className="font-mono text-sm text-slate-900 break-all">
                      {activeKey.key}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => copyToClipboard(activeKey.key)}
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    Copy Key
                  </Button>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Requests this month:</span>
                      <span className="font-semibold">{activeKey.requests_this_month || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total spent:</span>
                      <span className="font-semibold">${(activeKey.total_spent || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Generate an API key to start using this API
                  </p>
                  <Button
                    onClick={() => generateKeyMutation.mutate()}
                    disabled={generateKeyMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {generateKeyMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 mr-2" />
                        Generate API Key
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <APITester api={api} apiKey={activeKey?.key} />
      </div>
    </div>
  );
}