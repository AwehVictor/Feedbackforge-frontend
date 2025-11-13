import { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, ThumbsUp, Users, Zap, Award } from 'lucide-react';
import { MetricCard } from '../MetricCard';
import { feedbackService } from '@/services/feedbackService';

export const PulseMetricsCard = ({ filters, customFilters = null }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeFilters = customFilters || filters;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate days difference for the API
      const days = activeFilters.startDate && activeFilters.endDate
        ? Math.ceil((new Date(activeFilters.endDate) - new Date(activeFilters.startDate)) / (1000 * 60 * 60 * 24))
        : 30;

      const params = {
        days,
        serviceType: activeFilters.serviceType,
        branch: activeFilters.branch,
      };

      const response = await feedbackService.getPulseMetrics(params);
      setData(response);
    } catch (err) {
      console.error('Error fetching pulse metrics:', err);
      setError(err.response?.data?.message || 'Failed to load pulse metrics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeFilters.startDate, activeFilters.endDate, activeFilters.serviceType, activeFilters.branch]);

  // Don't render card if no data
  if (!loading && !error && !data?.data) {
    return null;
  }

  const getPerformanceColor = (rating) => {
    const colors = {
      'Excellent': 'bg-green-500',
      'Good': 'bg-blue-500',
      'Average': 'bg-yellow-500',
      'Needs Improvement': 'bg-red-500',
    };
    return colors[rating] || 'bg-gray-500';
  };

  const getCSATStatus = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 80) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 70) return { label: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getNPSStatus = (score) => {
    if (score >= 50) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 30) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 0) return { label: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const getCESStatus = (score) => {
    if (score >= 80) return { label: 'Easy', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 60) return { label: 'Moderate', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 40) return { label: 'Difficult', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Very Difficult', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const renderContent = () => {
    if (!data?.data) {
      return (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No pulse metrics data available</p>
          </div>
        </div>
      );
    }

    const { csat, nps, ces, avgRating, totalFeedback, period, breakdown, sentimentDistribution, performanceRating } = data.data;
    const csatStatus = getCSATStatus(csat);
    const npsStatus = getNPSStatus(nps);
    const cesStatus = getCESStatus(ces);

    return (
      <div className="h-full flex flex-col">
        {/* Performance Rating Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Overall Performance</p>
                <p className="text-2xl font-bold text-foreground">{performanceRating}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Period</p>
              <p className="text-lg font-semibold text-foreground">{period}</p>
              <p className="text-xs text-muted-foreground">{totalFeedback} responses</p>
            </div>
          </div>
        </div>

        {/* Main KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* CSAT Card */}
          <div className={`p-6 rounded-lg border-2 shadow-sm ${csatStatus.bg} border-gray-200`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ThumbsUp className={`w-5 h-5 ${csatStatus.color}`} />
                <p className="text-sm font-semibold text-gray-700">CSAT</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium ${csatStatus.bg} ${csatStatus.color} rounded-full border`}>
                {csatStatus.label}
              </span>
            </div>
            <p className={`text-5xl font-bold ${csatStatus.color} mb-2`}>
              {csat}%
            </p>
            <p className="text-xs text-gray-600 mb-3">Customer Satisfaction Score</p>
            <div className="pt-3 border-t border-gray-300">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Satisfied</span>
                <span className="font-semibold text-green-600">{breakdown.satisfied}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Unsatisfied</span>
                <span className="font-semibold text-red-600">{breakdown.unsatisfied}</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${csat}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* NPS Card */}
          <div className={`p-6 rounded-lg border-2 shadow-sm ${npsStatus.bg} border-gray-200`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className={`w-5 h-5 ${npsStatus.color}`} />
                <p className="text-sm font-semibold text-gray-700">NPS</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium ${npsStatus.bg} ${npsStatus.color} rounded-full border`}>
                {npsStatus.label}
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <p className={`text-5xl font-bold ${npsStatus.color}`}>
                {nps > 0 ? '+' : ''}{nps}
              </p>
              {nps >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-500" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-500" />
              )}
            </div>
            <p className="text-xs text-gray-600 mb-3">Net Promoter Score</p>
            <div className="pt-3 border-t border-gray-300">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-600">😊 Promoters</span>
                <span className="font-semibold">{breakdown.promoters}</span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">😐 Passives</span>
                <span className="font-semibold">{breakdown.passives}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-red-600">😞 Detractors</span>
                <span className="font-semibold">{breakdown.detractors}</span>
              </div>
            </div>
          </div>

          {/* CES Card */}
          <div className={`p-6 rounded-lg border-2 shadow-sm ${cesStatus.bg} border-gray-200`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className={`w-5 h-5 ${cesStatus.color}`} />
                <p className="text-sm font-semibold text-gray-700">CES</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium ${cesStatus.bg} ${cesStatus.color} rounded-full border`}>
                {cesStatus.label}
              </span>
            </div>
            <p className={`text-5xl font-bold ${cesStatus.color} mb-2`}>
              {ces}
            </p>
            <p className="text-xs text-gray-600 mb-3">Customer Effort Score</p>
            <div className="pt-3 border-t border-gray-300">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Avg Rating</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{avgRating}</span>
                  <span className="text-amber-500">★</span>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Based on</span>
                <span className="font-semibold">AI Sentiment</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${ces >= 60 ? 'bg-green-500' : ces >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${ces}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Distribution & Benchmarks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sentiment Distribution */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Sentiment Distribution
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-green-600 font-medium">✓ Positive</span>
                  <span className="font-semibold">
                    {sentimentDistribution.positive} ({((sentimentDistribution.positive / totalFeedback) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ width: `${(sentimentDistribution.positive / totalFeedback) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">− Neutral</span>
                  <span className="font-semibold">
                    {sentimentDistribution.neutral} ({((sentimentDistribution.neutral / totalFeedback) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-500"
                    style={{ width: `${(sentimentDistribution.neutral / totalFeedback) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-red-600 font-medium">✗ Negative</span>
                  <span className="font-semibold">
                    {sentimentDistribution.negative} ({((sentimentDistribution.negative / totalFeedback) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500"
                    style={{ width: `${(sentimentDistribution.negative / totalFeedback) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Benchmarks */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Industry Benchmarks
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <p className="font-semibold text-gray-700 mb-1">CSAT Standards:</p>
                <div className="space-y-0.5 text-gray-600">
                  <div className="flex justify-between">
                    <span>🟢 Excellent:</span>
                    <span>{data.data.benchmarks.csat.excellent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🔵 Good:</span>
                    <span>{data.data.benchmarks.csat.good}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🟡 Average:</span>
                    <span>{data.data.benchmarks.csat.average}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🔴 Poor:</span>
                    <span>{data.data.benchmarks.csat.poor}</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-300">
                <p className="font-semibold text-gray-700 mb-1">NPS Standards:</p>
                <div className="space-y-0.5 text-gray-600">
                  <div className="flex justify-between">
                    <span>🟢 Excellent:</span>
                    <span>{data.data.benchmarks.nps.excellent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🔵 Good:</span>
                    <span>{data.data.benchmarks.nps.good}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🟡 Average:</span>
                    <span>{data.data.benchmarks.nps.average}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🔴 Poor:</span>
                    <span>{data.data.benchmarks.nps.poor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MetricCard
      title="Pulse Metrics - Executive Summary"
      icon={Activity}
      loading={loading}
      error={error}
      onRefresh={fetchData}
      hasCustomFilters={customFilters !== null}
      height="h-auto"
    >
      {renderContent()}
    </MetricCard>
  );
};
