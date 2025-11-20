// @ts-nocheck
import React, { useState } from "react";
import { apiClient } from "@/lib/amplify-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Key, Play, Copy, Check, Loader2, AlertCircle, Edit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import { useAPIKeys } from "@/lib/APIKeyContext";
import { fetchAuthSession } from "aws-amplify/auth";

import APITester from "../components/api-detail/APITester";
import PricingDisplay from "../components/api-detail/PricingDisplay";
import APIDocumentation from "../components/api-detail/APIDocumentation";
import GenerateKeyDialog from "../components/api-detail/GenerateKeyDialog";
import EditAPIDialog from "../components/api-detail/EditAPIDialog";

export default function APIDetail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { apiName } = useParams(); // Get apiName from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const apiId = urlParams.get('id');
  const { user, isAuthenticated } = useAuth();
  const { hasKeyForAPI, getKeyForAPI, addAPIKey } = useAPIKeys();
  const [copied, setCopied] = useState(false);
  const [showGenerateKeyDialog, setShowGenerateKeyDialog] = useState(false);
  const [showEditAPIDialog, setShowEditAPIDialog] = useState(false);

  // Fetch API by name or ID
  const { data: api, isLoading } = useQuery({
    queryKey: ['api', apiName || apiId],
    queryFn: async () => {
      if (apiName) {
        // Fetch by name from URL param
        return await apiClient.apis.getByName(apiName);
      } else if (apiId) {
        // Fetch by ID from query param (legacy support)
        return await apiClient.apis.get(apiId);
      }
      return null;
    },
    enabled: !!(apiName || apiId),
  });

  // Get the active key for this API from context
  const currentApiId = api?.id || apiId;
  const activeKey = currentApiId ? getKeyForAPI(currentApiId) : undefined;
  const hasKey = currentApiId ? hasKeyForAPI(currentApiId) : false;

  const generateKeyMutation = useMutation({
    mutationFn: async (paymentData: { email: string; creditCard: string; cvv: string; expiry: string }) => {
      // Check if key already exists for this API
      if (hasKey) {
        throw new Error("An API key already exists for this API. Only one key per API is allowed.");
      }

      const { email, creditCard, cvv, expiry } = paymentData;

      // Get or create APIUser
      let apiUser = await apiClient.apiUsers.getByEmail(email);

      if (!apiUser) {
        // Create new API user with payment info
        // In production, you would process payment with Stripe here
        const last4 = creditCard.replace(/\s/g, '').slice(-4);

        apiUser = await apiClient.apiUsers.create({
          email: email,
          credit_card_last4: last4,
          // In production, you would get these from Stripe
          payment_method_id: `pm_${Date.now()}`, // Mock payment method ID
          stripe_customer_id: `cus_${Date.now()}`, // Mock customer ID
          total_spent: 0,
        });
      }

      // Generate API key using Lambda (if authenticated) or create directly
      let apiKey;

      if (isAuthenticated && user) {
        // For authenticated users, use the Lambda function
        const session = await fetchAuthSession();
        const credentials = session.credentials;

        if (credentials) {
          const url = 'https://i69kr7h50f.execute-api.us-east-1.amazonaws.com/default/getApiKey';
          const body = JSON.stringify({
            userId: user.username,
            email: email,
          });

          const { Sha256 } = await import('@aws-crypto/sha256-js');
          const { SignatureV4 } = await import('@smithy/signature-v4');

          const signer = new SignatureV4({
            credentials: {
              accessKeyId: credentials.accessKeyId,
              secretAccessKey: credentials.secretAccessKey,
              sessionToken: credentials.sessionToken,
            },
            region: 'us-east-1',
            service: 'execute-api',
            sha256: Sha256,
          });

          const request = {
            method: 'POST',
            protocol: 'https:',
            hostname: 'i69kr7h50f.execute-api.us-east-1.amazonaws.com',
            path: '/default/getApiKey',
            headers: {
              'Content-Type': 'application/json',
              'host': 'i69kr7h50f.execute-api.us-east-1.amazonaws.com',
            },
            body,
          };

          const signedRequest = await signer.sign(request);

          const response = await fetch(url, {
            method: 'POST',
            headers: signedRequest.headers,
            body,
          });

          if (response.ok) {
            const data = await response.json();
            apiKey = data.apiKey || data.key || data.api_key;
          }
        }
      }

      // If Lambda didn't work or user is unauthenticated, generate a simple key
      if (!apiKey) {
        apiKey = `sk_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      }

      // Store the generated key in database
      const createdKey = await apiClient.apiKeys.create({
        api_id: currentApiId,
        user_id: apiUser.id,
        user_email: email,
        key: apiKey,
        status: 'active',
        requests_made: 0,
        requests_this_month: 0,
        total_spent: 0,
      });

      return createdKey;
    },
    onSuccess: (createdKey) => {
      // Add the key to context so all routes are aware immediately
      if (createdKey) {
        addAPIKey(createdKey);
      }
      queryClient.invalidateQueries({ queryKey: ['apiKeys', currentApiId] });
      setShowGenerateKeyDialog(false);
      toast.success("API Key generated successfully! You can now test the API.");
    },
    onError: (error: any) => {
      console.error('API Key generation error:', error);
      toast.error(error.message || "Failed to generate API key");
    },
  });

  const updateAPIMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!api) throw new Error("API not found");
      return await apiClient.apis.update(api.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api', apiName || apiId] });
      setShowEditAPIDialog(false);
      toast.success("API updated successfully!");
    },
    onError: (error: any) => {
      console.error('API update error:', error);
      toast.error(error.message || "Failed to update API");
    },
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if current user is the owner of this API
  const isOwner = isAuthenticated && user && api && (
    api.owner_id === user.userId ||
    api.owner_id === user.username
  );

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
                <span>Published by {api.owner_id?.split('@')[0] || 'Unknown'}</span>
                <span>•</span>
                <span>{api.total_requests?.toLocaleString() || 0} requests served</span>
              </div>
            </div>
            {isOwner && (
              <Button
                variant="outline"
                onClick={() => setShowEditAPIDialog(true)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit API
              </Button>
            )}
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
                    Generate an API key to start using this API. {!isAuthenticated && "No account required!"}
                  </p>
                  <Button
                    onClick={() => setShowGenerateKeyDialog(true)}
                    disabled={generateKeyMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Generate API Key
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <APITester api={api} apiKey={activeKey} />

        {/* Generate Key Dialog */}
        <GenerateKeyDialog
          open={showGenerateKeyDialog}
          onOpenChange={setShowGenerateKeyDialog}
          onSubmit={(data) => generateKeyMutation.mutateAsync(data)}
          isLoading={generateKeyMutation.isPending}
        />

        {/* Edit API Dialog */}
        <EditAPIDialog
          open={showEditAPIDialog}
          onOpenChange={setShowEditAPIDialog}
          api={api}
          onSubmit={(data) => updateAPIMutation.mutateAsync(data)}
          isLoading={updateAPIMutation.isPending}
        />
      </div>
    </div>
  );
}