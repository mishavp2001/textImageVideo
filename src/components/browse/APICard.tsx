// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, DollarSign, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categoryColors = {
  "AI/ML": "bg-purple-100 text-purple-700 border-purple-200",
  "Data": "bg-blue-100 text-blue-700 border-blue-200",
  "Finance": "bg-green-100 text-green-700 border-green-200",
  "Social": "bg-pink-100 text-pink-700 border-pink-200",
  "Weather": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "Maps": "bg-orange-100 text-orange-700 border-orange-200",
  "Utilities": "bg-slate-100 text-slate-700 border-slate-200",
  "Other": "bg-gray-100 text-gray-700 border-gray-200"
};

const methodColors = {
  "GET": "bg-green-50 text-green-700 border-green-200",
  "POST": "bg-blue-50 text-blue-700 border-blue-200",
  "PUT": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "DELETE": "bg-red-50 text-red-700 border-red-200",
  "PATCH": "bg-purple-50 text-purple-700 border-purple-200"
};

export default function APICard({ api }) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200/60 hover:border-blue-300 overflow-hidden bg-white">
      <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <Badge className={`${categoryColors[api.category]} border font-medium`}>
            {api.category}
          </Badge>
          <Badge variant="outline" className={`${methodColors[api.method]} border font-mono text-xs`}>
            {api.method}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {api.name}
        </CardTitle>
        <p className="text-slate-600 text-sm line-clamp-2 mt-2">
          {api.description || "No description provided"}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              Free tier
            </span>
            <span className="font-semibold text-slate-900">
              {api.free_requests_limit || 0} requests/month
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              After free tier
            </span>
            <span className="font-semibold text-slate-900">
              ${api.price_per_request?.toFixed(3)}/request
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" />
              Total requests
            </span>
            <span className="font-semibold text-slate-900">
              {api.total_requests?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        <Link to={createPageUrl(`APIDetail?id=${api.id}`)}>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group-hover:shadow-lg transition-all duration-300">
            View Details
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}