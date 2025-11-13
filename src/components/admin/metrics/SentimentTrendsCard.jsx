import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { MetricCard } from '../MetricCard';
import { feedbackService } from '@/services/feedbackService';

export const SentimentTrendsCard = ({ filters, customFilters = null }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('daily');

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
        period,
        days,
        serviceType: activeFilters.serviceType,
        branch: activeFilters.branch,
      };

      const response = await feedbackService.getSentimentTrends(params);
      setData(response);
    } catch (err) {
      console.error('Error fetching sentiment trends:', err);
      setError(err.response?.data?.message || 'Failed to load sentiment trends data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period, activeFilters.startDate, activeFilters.endDate, activeFilters.serviceType, activeFilters.branch]);

  // Don't render card if no data
  if (!loading && !error && (!data?.data || data.data.length === 0)) {
    return null;
  }

  const transformData = () => {
    if (!data?.data) return [];

    // Group by period
    const grouped = {};
    
    data.data.forEach(item => {
      const date = item.period;
      if (!grouped[date]) {
        grouped[date] = {
          date,
          positive: 0,
          neutral: 0,
          negative: 0,
          totalCount: 0,
        };
      }
      
      grouped[date][item.sentiment] = item.count;
      grouped[date].totalCount += item.count;
    });

    // Convert to array and calculate percentages
    return Object.values(grouped).map(item => ({
      date: formatDate(item.date),
      positive: item.positive,
      neutral: item.neutral,
      negative: item.negative,
      positivePercent: ((item.positive / item.totalCount) * 100).toFixed(1),
      neutralPercent: ((item.neutral / item.totalCount) * 100).toFixed(1),
      negativePercent: ((item.negative / item.totalCount) * 100).toFixed(1),
      total: item.totalCount,
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderContent = () => {
    if (!data?.data || data.data.length === 0) {
      return null;
    }

    const chartData = transformData();
    
    // Calculate overall stats
    const totalPositive = data.data.filter(d => d.sentiment === 'positive').reduce((sum, d) => sum + d.count, 0);
    const totalNegative = data.data.filter(d => d.sentiment === 'negative').reduce((sum, d) => sum + d.count, 0);
    const totalNeutral = data.data.filter(d => d.sentiment === 'neutral').reduce((sum, d) => sum + d.count, 0);
    const totalFeedback = totalPositive + totalNegative + totalNeutral;
    
    const positivePercent = ((totalPositive / totalFeedback) * 100).toFixed(1);
    const negativePercent = ((totalNegative / totalFeedback) * 100).toFixed(1);
    const neutralPercent = ((totalNeutral / totalFeedback) * 100).toFixed(1);

    // Calculate trend (compare first half vs second half)
    const midPoint = Math.floor(chartData.length / 2);
    const firstHalf = chartData.slice(0, midPoint);
    const secondHalf = chartData.slice(midPoint);
    
    const firstHalfPositive = firstHalf.reduce((sum, d) => sum + d.positive, 0) / firstHalf.length || 0;
    const secondHalfPositive = secondHalf.reduce((sum, d) => sum + d.positive, 0) / secondHalf.length || 0;
    const trendDirection = secondHalfPositive > firstHalfPositive ? 'up' : 'down';
    const trendPercent = Math.abs(((secondHalfPositive - firstHalfPositive) / firstHalfPositive) * 100).toFixed(1);

    return (
      <div className="h-full flex flex-col">
        {/* Header with Period Selection */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Summary Stats */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="font-medium">{positivePercent}% Positive</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                <span className="font-medium">{neutralPercent}% Neutral</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="font-medium">{negativePercent}% Negative</span>
              </div>
            </div>

            {/* Trend Indicator */}
            {!isNaN(trendPercent) && trendPercent !== 'Infinity' && (
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                trendDirection === 'up' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {trendDirection === 'up' ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{trendPercent}% trend</span>
              </div>
            )}
          </div>

          {/* Period Selection */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            {['daily', 'weekly', 'monthly'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors capitalize ${
                  period === p
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Total Feedback</p>
            <p className="text-2xl font-bold text-foreground">{totalFeedback}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center border border-green-200">
            <p className="text-xs text-green-700 font-medium">Positive</p>
            <p className="text-2xl font-bold text-green-600">{totalPositive}</p>
            <p className="text-xs text-green-600">{positivePercent}%</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center border border-gray-200">
            <p className="text-xs text-gray-700 font-medium">Neutral</p>
            <p className="text-2xl font-bold text-gray-600">{totalNeutral}</p>
            <p className="text-xs text-gray-600">{neutralPercent}%</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-center border border-red-200">
            <p className="text-xs text-red-700 font-medium">Negative</p>
            <p className="text-2xl font-bold text-red-600">{totalNegative}</p>
            <p className="text-xs text-red-600">{negativePercent}%</p>
          </div>
        </div>

        {/* Line Chart */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold text-foreground mb-2">{label}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                              <span className="text-muted-foreground">Positive:</span>
                            </div>
                            <span className="font-semibold">{data.positive} ({data.positivePercent}%)</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                              <span className="text-muted-foreground">Neutral:</span>
                            </div>
                            <span className="font-semibold">{data.neutral} ({data.neutralPercent}%)</span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                              <span className="text-muted-foreground">Negative:</span>
                            </div>
                            <span className="font-semibold">{data.negative} ({data.negativePercent}%)</span>
                          </div>
                          <div className="pt-2 border-t mt-2">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-muted-foreground">Total:</span>
                              <span className="font-bold">{data.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Line 
                type="monotone" 
                dataKey="positive" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Positive"
              />
              <Line 
                type="monotone" 
                dataKey="neutral" 
                stroke="#9ca3af" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Neutral"
              />
              <Line 
                type="monotone" 
                dataKey="negative" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Negative"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900">Trend Analysis</p>
              <p className="text-xs text-blue-700 mt-1">
                {trendDirection === 'up' 
                  ? `Positive sentiment is trending upward by ${trendPercent}%. Keep up the good work!`
                  : `Positive sentiment is declining by ${trendPercent}%. Review recent changes and address customer concerns.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MetricCard
      title="Sentiment Trends Over Time"
      icon={TrendingUp}
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
