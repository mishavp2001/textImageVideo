// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import { format } from "date-fns";

const statusColors = {
  active: "bg-green-100 text-green-700 border-green-200",
  revoked: "bg-red-100 text-red-700 border-red-200",
  suspended: "bg-yellow-100 text-yellow-700 border-yellow-200"
};

export default function APIKeyCard({ keyData }) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(keyData.key);
    setCopied(true);
    toast.success("API key copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const maskKey = (key) => {
    if (!key) return '';
    return key.substring(0, 12) + '•'.repeat(20);
  };

  return (
    <Card className="border-slate-200/60 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {keyData.api?.name || 'Unknown API'}
                </h3>
                <p className="text-sm text-slate-600">
                  Created {format(new Date(keyData.created_date), 'MMM d, yyyy')}
                </p>
              </div>
              <Badge className={`${statusColors[keyData.status]} border font-medium capitalize`}>
                {keyData.status}
              </Badge>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between gap-4">
              <code className="text-sm font-mono text-slate-900 flex-1 overflow-x-auto">
                {showKey ? keyData.key : maskKey(keyData.key)}
              </code>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowKey(!showKey)}
                  className="h-8 w-8"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyKey}
                  className="h-8 w-8"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-600 block mb-1">This Month</span>
                <span className="font-semibold text-slate-900">
                  {keyData.requests_this_month || 0} requests
                </span>
              </div>
              <div>
                <span className="text-slate-600 block mb-1">Total Requests</span>
                <span className="font-semibold text-slate-900">
                  {keyData.requests_made?.toLocaleString() || 0}
                </span>
              </div>
              <div>
                <span className="text-slate-600 block mb-1">Total Spent</span>
                <span className="font-semibold text-slate-900">
                  ${(keyData.total_spent || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex lg:flex-col gap-2">
            <Link to={createPageUrl(`APIDetail?id=${keyData.api_id}`)} className="flex-1 lg:flex-none">
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 lg:mr-0 mr-2" />
                <span className="lg:hidden">View API</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}