import { useState, useEffect } from 'react';
import { PieChart as PieChartIcon, TrendingUp, Star } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { MetricCard } from '../MetricCard';
import { feedbackService } from '@/services/feedbackService';

const COLORS = {
  positive: '#22c55e', // green
  neutral: '#f59e0b',  // amber
  negative: '#ef4444', // red
};

export const SentimentOverviewCard = ({ filters, customFilters = null }) => {
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

      const response = await feedbackService.getSentimentOverview(params);
      setData(response);
    } catch (err) {
      console.error('Error fetching sentiment overview:', err);
      setError(err.response?.data?.message || 'Failed to load sentiment data');
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

  const renderContent = () => {
    if (!data) return null;

    const chartData = data.data.map((item) => ({
      name: item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1),
      value: item.count,
      percentage: item.percentage,
      sentiment: item.sentiment,
    }));

    return (
      <div className="h-full flex flex-col">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Feedback</p>
            <p className="text-2xl font-bold text-foreground">{data.summary.totalFeedback}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{data.summary.overallAvgRating}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Sentiment</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{data.summary.overallSentimentScore}%</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.sentiment]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold text-foreground">{data.name}</p>
                        <p className="text-sm text-muted-foreground">Count: {data.value}</p>
                        <p className="text-sm text-muted-foreground">Percentage: {data.percentage}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Period Info */}
        {data.period && (
          <div className="mt-2 text-center text-xs text-muted-foreground">
            Period: {new Date(data.period.startDate).toLocaleDateString()} - {data.period.endDate === 'now' ? 'Now' : new Date(data.period.endDate).toLocaleDateString()}
          </div>
        )}
      </div>
    );
  };

  return (
    <MetricCard
      title="Sentiment Overview"
      icon={PieChartIcon}
      loading={loading}
      error={error}
      onRefresh={fetchData}
      hasCustomFilters={customFilters !== null}
      height="h-[500px]"
    >
      {renderContent()}
    </MetricCard>
  );
};

