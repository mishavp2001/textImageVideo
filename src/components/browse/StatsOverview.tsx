import React from 'react';
import { Zap, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function StatsOverview({ apis }) {
  const totalAPIs = apis.length;
  const totalRequests = apis.reduce((sum, api) => sum + (api.total_requests || 0), 0);
  const totalRevenue = apis.reduce((sum, api) => sum + (api.total_revenue || 0), 0);
  const activeAPIs = apis.filter(api => api.status === 'active').length;

  const stats = [
    {
      label: "Total APIs",
      value: totalAPIs,
      icon: Zap,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      label: "Active APIs",
      value: activeAPIs,
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      label: "Total Requests",
      value: totalRequests.toLocaleString(),
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      label: "Platform Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}