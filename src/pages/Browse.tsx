import React, { useState } from "react";
import { apiClient } from "@/lib/amplify-client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, TrendingUp, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import APICard from "../components/browse/APICard";
import PublishAPIDialog from "../components/browse/PublishAPIDialog";
import StatsOverview from "../components/browse/StatsOverview";

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  const { data: apis = [], isLoading } = useQuery({
    queryKey: ['apis'],
    queryFn: () => apiClient.apis.list(),
  });

  const filteredAPIs = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         api.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || api.category === categoryFilter;
    return matchesSearch && matchesCategory && api.status === 'active';
  });

  const categories = ["AI/ML", "Data", "Finance", "Social", "Weather", "Maps", "Utilities", "Other"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Discover APIs</h1>
            <p className="text-slate-600">Browse, test, and integrate powerful APIs into your applications</p>
          </div>
          <Button
            onClick={() => setShowPublishDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-5 h-5 mr-2" />
            Publish API
          </Button>
        </div>

        <StatsOverview apis={apis} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search APIs by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base border-slate-200 focus:border-blue-500 rounded-xl"
              />
            </div>
            <div className="flex gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 h-12 border-slate-200 rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                <div className="h-4 bg-slate-200 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : filteredAPIs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No APIs found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search or filters</p>
            <Button onClick={() => setShowPublishDialog(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Publish Your First API
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAPIs.map((api) => (
              <APICard key={api.id} api={api} />
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