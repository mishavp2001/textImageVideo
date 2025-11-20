// @ts-nocheck
import React, { useState } from "react";
import { apiClient } from "@/lib/amplify-client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  CreditCard, 
  Key, 
  Activity, 
  DollarSign,
  Calendar,
  Shield,
  TrendingUp,
  Package
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useAPIKeys } from "@/lib/APIKeyContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { apiKeys } = useAPIKeys();

  // Fetch user's APIs
  const { data: userAPIs = [], isLoading: apisLoading } = useQuery({
    queryKey: ['userAPIs', user?.userId],
    queryFn: async () => {
      const allAPIs = await apiClient.apis.list();
      return allAPIs.filter((api: any) => api.owner_id === user?.userId || api.owner_id === user?.username);
    },
    enabled: !!user,
  });

  // Fetch APIUser record (for payment info)
  const { data: apiUser } = useQuery({
    queryKey: ['apiUser', user?.username],
    queryFn: async () => {
      if (!user?.username) return null;
      return await apiClient.apiUsers.getByEmail(user.username);
    },
    enabled: !!user?.username,
  });

  // Calculate statistics
  const totalAPIs = userAPIs.length;
  const totalKeys = apiKeys.length;
  const totalRevenue = userAPIs.reduce((sum: number, api: any) => sum + (api.total_revenue || 0), 0);
  const totalRequests = userAPIs.reduce((sum: number, api: any) => sum + (api.total_requests || 0), 0);
  const totalSpent = apiKeys.reduce((sum: number, key: any) => sum + (key.total_spent || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center">
            <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In Required</h2>
            <p className="text-slate-600 mb-6">Please sign in to view your profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
          <p className="text-slate-600">Manage your account, APIs, and API keys</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">My APIs</p>
                  <p className="text-3xl font-bold text-slate-900">{totalAPIs}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">API Keys</p>
                  <p className="text-3xl font-bold text-slate-900">{totalKeys}</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50">
                  <Key className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">Total Revenue</p>
                  <p className="text-3xl font-bold text-slate-900">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-50">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-2">Total Requests</p>
                  <p className="text-3xl font-bold text-slate-900">{totalRequests.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-orange-50">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="account">Account Info</TabsTrigger>
            <TabsTrigger value="apis">My APIs ({totalAPIs})</TabsTrigger>
            <TabsTrigger value="keys">My Keys ({totalKeys})</TabsTrigger>
          </TabsList>

          {/* Account Info Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="border-slate-200/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Email</p>
                      <p className="font-semibold text-slate-900">{user?.username}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Verified
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">User ID</p>
                      <p className="font-mono text-sm text-slate-900">{user?.userId}</p>
                    </div>
                  </div>
                </div>

                {apiUser && (
                  <>
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-600">Payment Method</p>
                          <p className="font-semibold text-slate-900">
                            •••• {apiUser.credit_card_last4 || "Not set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-600">Total Spent</p>
                          <p className="font-semibold text-slate-900">
                            ${(apiUser.total_spent || totalSpent).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My APIs Tab */}
          <TabsContent value="apis" className="space-y-6">
            {apisLoading ? (
              <Card className="border-slate-200/60">
                <CardContent className="p-12 text-center">
                  <p className="text-slate-600">Loading your APIs...</p>
                </CardContent>
              </Card>
            ) : userAPIs.length === 0 ? (
              <Card className="border-slate-200/60">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No APIs Yet</h3>
                  <p className="text-slate-600 mb-6">Publish your first API to start earning</p>
                  <Link to="/MyAPIs">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Publish API
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userAPIs.map((api: any) => (
                  <Card key={api.id} className="border-slate-200/60 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-slate-900">{api.name}</h3>
                            <Badge variant="outline" className="font-mono text-xs">
                              {api.method}
                            </Badge>
                            <Badge className={api.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                              {api.status}
                            </Badge>
                          </div>
                          <p className="text-slate-600 text-sm mb-4">{api.description}</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-slate-600">Requests</span>
                              <p className="font-semibold text-slate-900">{api.total_requests?.toLocaleString() || 0}</p>
                            </div>
                            <div>
                              <span className="text-slate-600">Revenue</span>
                              <p className="font-semibold text-slate-900">${(api.total_revenue || 0).toFixed(2)}</p>
                            </div>
                            <div>
                              <span className="text-slate-600">Price</span>
                              <p className="font-semibold text-slate-900">${(api.price_per_request || 0).toFixed(4)}/req</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Link to={`/api/${encodeURIComponent(api.name)}`}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                          <Link to={`/Analytics?id=${api.id}`}>
                            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                              Analytics
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Keys Tab */}
          <TabsContent value="keys" className="space-y-6">
            {apiKeys.length === 0 ? (
              <Card className="border-slate-200/60">
                <CardContent className="p-12 text-center">
                  <Key className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No API Keys</h3>
                  <p className="text-slate-600 mb-6">Generate an API key to start using APIs</p>
                  <Link to="/Browse">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Browse APIs
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {apiKeys.map((key: any) => (
                  <Card key={key.id} className="border-slate-200/60">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {key.api?.name || 'Unknown API'}
                          </h3>
                          <p className="text-sm text-slate-600">
                            Created {key.createdAt ? format(new Date(key.createdAt), 'MMM d, yyyy') : 'Unknown'}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Requests Made</span>
                          <p className="font-semibold text-slate-900">{key.requests_made?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">This Month</span>
                          <p className="font-semibold text-slate-900">{key.requests_this_month || 0}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Total Spent</span>
                          <p className="font-semibold text-slate-900">${(key.total_spent || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

