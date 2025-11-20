// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, DollarSign, ExternalLink, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-gray-100 text-gray-700 border-gray-200",
  maintenance: "bg-yellow-100 text-yellow-700 border-yellow-200"
};

interface MyAPICardProps {
  api: any;
}

export default function MyAPICard({ api }: MyAPICardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200/60 hover:border-purple-300 overflow-hidden bg-white">
      <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <Badge className={`${statusColors[api.status]} border font-medium capitalize`}>
            {api.status}
          </Badge>
          <Badge variant="outline" className="font-mono text-xs">
            {api.method}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-slate-900">
          {api.name}
        </CardTitle>
        <p className="text-slate-600 text-sm line-clamp-2 mt-2">
          {api.description || "No description"}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Requests
            </span>
            <span className="font-semibold text-slate-900">
              {api.total_requests?.toLocaleString() || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              Revenue
            </span>
            <span className="font-semibold text-slate-900">
              ${(api.total_revenue || 0).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to={`/api/${encodeURIComponent(api.name)}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              View
            </Button>
          </Link>
          <Link to={createPageUrl(`Analytics?id=${api.id}`)} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}