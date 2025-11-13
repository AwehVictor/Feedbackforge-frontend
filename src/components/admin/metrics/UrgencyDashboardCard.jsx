import { useState, useEffect } from 'react';
import { AlertCircle, Clock, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MetricCard } from '../MetricCard';
import { feedbackService } from '@/services/feedbackService';

const URGENCY_CONFIG = {
  critical: {
    color: '#dc2626',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    label: 'Critical',
    icon: '🔴',
  },
  high: {
    color: '#ea580c',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-300',
    label: 'High',
    icon: '🟠',
  },
  medium: {
    color: '#ca8a04',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    label: 'Medium',
    icon: '🟡',
  },
  low: {
    color: '#16a34a',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    label: 'Low',
    icon: '🟢',
  },
};

export const UrgencyDashboardCard = ({ filters, customFilters = null }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeFilters = customFilters || filters;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        startDate: activeFilters.startDate,
        endDate: activeFilters.endDate,
        serviceType: activeFilters.serviceType,
        branch: activeFilters.branch,
      };

      const response = await feedbackService.getUrgencyDashboard(params);
      setData(response);
    } catch (err) {
      console.error('Error fetching urgency dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load urgency dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeFilters.startDate, activeFilters.endDate, activeFilters.serviceType, activeFilters.branch]);

  // Don't render card if no data
  if (!loading && !error && (!data?.data || data.data.length === 0)) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const renderContent = () => {
    if (!data?.data || data.data.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No urgency data available</p>
          </div>
        </div>
      );
    }

    const chartData = data.data.map(item => ({
      name: URGENCY_CONFIG[item.urgency]?.label || item.urgency,
      count: item.count,
      urgency: item.urgency,
      color: URGENCY_CONFIG[item.urgency]?.color || '#94a3b8',
      avgSentimentScore: item.avgSentimentScore,
      avgResponseTime: item.avgResponseTime,
      oldestFeedback: item.oldestFeedback,
      newestFeedback: item.newestFeedback,
    }));

    const totalIssues = data.data.reduce((sum, item) => sum + item.count, 0);
    const criticalAndHigh = data.data
      .filter(item => item.urgency === 'critical' || item.urgency === 'high')
      .reduce((sum, item) => sum + item.count, 0);
    const avgResponseTime = (
      data.data.reduce((sum, item) => sum + item.avgResponseTime * item.count, 0) / totalIssues
    ).toFixed(1);

    return (
      <div className="h-fit flex flex-col">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-muted-foreground">Total Open Issues</p>
            <p className="text-2xl font-bold text-foreground">{totalIssues}</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-700 font-medium flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Critical + High
            </p>
            <p className="text-2xl font-bold text-red-600">{criticalAndHigh}</p>
            <p className="text-xs text-red-600 mt-0.5">
              {((criticalAndHigh / totalIssues) * 100).toFixed(0)}% of total
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              Avg Response Time
            </p>
            <p className="text-2xl font-bold text-foreground">{avgResponseTime}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        </div>

      

        {/* Urgency Breakdown Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {data.data.map((item, index) => {
            const config = URGENCY_CONFIG[item.urgency];
            return (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 ${config.bgColor} ${config.borderColor}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{config.icon}</span>
                  <span className={`text-xs font-semibold ${config.textColor}`}>
                    {config.label.toUpperCase()}
                  </span>
                </div>
                <p className={`text-3xl font-bold ${config.textColor} mb-1`}>
                  {item.count}
                </p>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{item.avgResponseTime}d avg</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <TrendingDown className="w-3 h-3" />
                    <span>{item.avgSentimentScore}% sentiment</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Alert for Critical Items */}
        {criticalAndHigh > 0 && (
          <div className="mt-3 p-3 bg-red-50 border-2 border-red-300 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900">
                  Action Required: {criticalAndHigh} High Priority Issues
                </p>
                <p className="text-xs text-red-700 mt-1">
                  These issues require immediate attention. Review and prioritize for resolution.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <MetricCard
      title="Urgency Dashboard"
      icon={AlertCircle}
      loading={loading}
      error={error}
      onRefresh={fetchData}
      hasCustomFilters={customFilters !== null}
      height="h-fit"
    >
      {renderContent()}
    </MetricCard>
  );
};
