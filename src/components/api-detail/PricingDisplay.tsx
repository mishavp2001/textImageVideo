import React from 'react';
import { Zap, DollarSign, TrendingUp } from 'lucide-react';

export default function PricingDisplay({ api }) {
  const estimatedCost = (requests) => {
    const freeLimit = api.free_requests_limit || 0;
    if (requests <= freeLimit) return 0;
    return ((requests - freeLimit) * (api.price_per_request || 0)).toFixed(2);
  };

  const pricingTiers = [
    { requests: 100, label: "Starter" },
    { requests: 1000, label: "Growth" },
    { requests: 10000, label: "Scale" },
    { requests: 100000, label: "Enterprise" }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Free Tier</h4>
            <p className="text-sm text-slate-600">Get started for free</p>
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900 mb-2">
          {api.free_requests_limit} <span className="text-lg font-normal text-slate-600">requests/month</span>
        </div>
        <p className="text-sm text-slate-600">No credit card required</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Pay-as-you-go</h4>
            <p className="text-sm text-slate-600">Only pay for what you use</p>
          </div>
        </div>
        <div className="text-3xl font-bold text-slate-900 mb-2">
          ${api.price_per_request?.toFixed(4)} <span className="text-lg font-normal text-slate-600">per request</span>
        </div>
        <p className="text-sm text-slate-600">After free tier limit</p>
      </div>
    </div>
  );
}