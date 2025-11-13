import { useState, useEffect } from 'react';
import { Lightbulb, AlertCircle, Clock, User, Tag, ArrowRight, CheckCircle } from 'lucide-react';
import { MetricCard } from '../MetricCard';
import { feedbackService } from '@/services/feedbackService';

const URGENCY_CONFIG = {
  critical: {
    color: 'bg-red-100 text-red-800 border-red-300',
    dotColor: 'bg-red-500',
    label: 'Critical',
  },
  high: {
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    dotColor: 'bg-orange-500',
    label: 'High',
  },
  medium: {
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    dotColor: 'bg-yellow-500',
    label: 'Medium',
  },
  low: {
    color: 'bg-green-100 text-green-800 border-green-300',
    dotColor: 'bg-green-500',
    label: 'Low',
  },
};

const SENTIMENT_CONFIG = {
  positive: { icon: '✓', color: 'text-green-600', bg: 'bg-green-50' },
  neutral: { icon: '−', color: 'text-gray-600', bg: 'bg-gray-50' },
  negative: { icon: '✗', color: 'text-red-600', bg: 'bg-red-50' },
};

export const ActionableInsightsCard = ({ filters, customFilters = null }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUrgency, setSelectedUrgency] = useState(null);

  const activeFilters = customFilters || filters;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        limit: 20,
        urgency: selectedUrgency,
        serviceType: activeFilters.serviceType,
        branch: activeFilters.branch,
      };

      const response = await feedbackService.getActionableInsights(params);
      setData(response);
    } catch (err) {
      console.error('Error fetching actionable insights:', err);
      setError(err.response?.data?.message || 'Failed to load actionable insights data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedUrgency, activeFilters.serviceType, activeFilters.branch]);

  // Don't render card if no data
  if (!loading && !error && (!data?.data || data.data.length === 0)) {
    return null;
  }

  const formatCategoryName = (category) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderContent = () => {
    if (!data?.data || data.data.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Lightbulb className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No actionable insights available</p>
            <p className="text-sm mt-2">AI-powered recommendations will appear here</p>
          </div>
        </div>
      );
    }

    const criticalCount = data.data.filter(i => i.urgency === 'critical').length;
    const highCount = data.data.filter(i => i.urgency === 'high').length;
    const overdueCount = data.data.filter(i => i.isOverdue).length;

    return (
      <div className="h-full flex flex-col">
        {/* Summary & Filters */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="font-medium">{data.count} Insights</span>
              </div>
              {criticalCount > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">{criticalCount} Critical</span>
                </div>
              )}
              {overdueCount > 0 && (
                <div className="flex items-center gap-2 text-orange-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{overdueCount} Overdue</span>
                </div>
              )}
            </div>

            {/* Urgency Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedUrgency(null)}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  selectedUrgency === null
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {['critical', 'high', 'medium', 'low'].map(urgency => (
                <button
                  key={urgency}
                  onClick={() => setSelectedUrgency(urgency)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                    selectedUrgency === urgency
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {URGENCY_CONFIG[urgency].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Insights List */}
        <div className="flex-1 overflow-auto space-y-3">
          {data.data.map((insight, index) => {
            const urgencyConfig = URGENCY_CONFIG[insight.urgency] || URGENCY_CONFIG.low;
            const sentimentConfig = SENTIMENT_CONFIG[insight.sentiment] || SENTIMENT_CONFIG.neutral;

            return (
              <div
                key={insight.id || index}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  insight.isOverdue ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="pt-1">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {/* Urgency Badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${urgencyConfig.color}`}>
                          <span className={`w-2 h-2 rounded-full ${urgencyConfig.dotColor}`}></span>
                          {urgencyConfig.label}
                        </span>

                        {/* Sentiment Badge */}
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${sentimentConfig.bg} ${sentimentConfig.color}`}>
                          {sentimentConfig.icon} {insight.sentiment}
                        </span>

                        {/* Overdue Badge */}
                        {insight.isOverdue && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            Overdue
                          </span>
                        )}
                      </div>

                      {/* Insight Text */}
                      <p className="text-sm text-foreground font-medium mb-3">
                        {insight.actionableInsights}
                      </p>

                      {/* Metadata Row */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{insight.customerName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          <span>{insight.serviceType}</span>
                        </div>
                        {insight.categories && insight.categories.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 bg-gray-100 rounded">
                              {formatCategoryName(insight.categories[0])}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{insight.daysSinceSubmission} days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reference Number */}
                  <div className="text-right ml-4">
                    <p className="text-xs text-muted-foreground mb-1">Ref</p>
                    <p className="text-xs font-mono font-semibold text-foreground">
                      {insight.referenceNumber}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(insight.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                {insight.isNegative && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                      <ArrowRight className="w-3 h-3" />
                      <span>Review and Take Action</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Priority Alert */}
        {criticalCount > 0 && (
          <div className="mt-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-semibold text-red-900">
                  {criticalCount} Critical {criticalCount === 1 ? 'Issue' : 'Issues'} Require Immediate Attention
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Review these insights and assign to appropriate teams for resolution.
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
      title="Actionable Insights"
      icon={Lightbulb}
      loading={loading}
      error={error}
      onRefresh={fetchData}
      hasCustomFilters={customFilters !== null}
      height="h-[600px]"
    >
      {renderContent()}
    </MetricCard>
  );
};
