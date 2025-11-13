import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { MetricCard } from '../MetricCard';
import { feedbackService } from '@/services/feedbackService';

const PERFORMANCE_COLORS = {
  'Excellent': '#22c55e',
  'Good': '#84cc16',
  'Average': '#f59e0b',
  'Needs Attention': '#f97316',
  'Critical': '#ef4444',
};

export const ServicePerformanceCard = ({ filters, customFilters = null }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('satisfaction'); // 'satisfaction', 'rating', 'sentiment'

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

      const response = await feedbackService.getServicePerformance(params);
      setData(response);
    } catch (err) {
      console.error('Error fetching service performance:', err);
      setError(err.response?.data?.message || 'Failed to load service performance data');
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

  const getChartData = () => {
    if (!data?.data) return [];
    
    return data.data.map(item => ({
      name: item.serviceType,
      satisfaction: item.satisfactionScore,
      avgRating: item.avgRating,
      sentiment: item.avgSentimentScore,
      totalFeedback: item.totalFeedback,
      performanceRating: item.performanceRating,
      color: PERFORMANCE_COLORS[item.performanceRating] || '#94a3b8',
      positivePercentage: item.positivePercentage,
      negativePercentage: item.negativePercentage,
      neutralPercentage: item.neutralPercentage,
      highUrgencyCount: item.highUrgencyCount,
    }));
  };

  const renderContent = () => {
    if (!data?.data || data.data.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No service performance data available</p>
          </div>
        </div>
      );
    }

    const chartData = getChartData();
    const dataKey = viewMode === 'satisfaction' ? 'satisfaction' : 
                    viewMode === 'rating' ? 'avgRating' : 'sentiment';
    const yAxisLabel = viewMode === 'satisfaction' ? 'Satisfaction %' : 
                      viewMode === 'rating' ? 'Avg Rating' : 'Sentiment Score';

    return (
      <div className="h-full flex flex-col">
        {/* View Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode('satisfaction')}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
              viewMode === 'satisfaction' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Satisfaction Score
          </button>
          <button
            onClick={() => setViewMode('rating')}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
              viewMode === 'rating' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Avg Rating
          </button>
          <button
            onClick={() => setViewMode('sentiment')}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
              viewMode === 'sentiment' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sentiment Score
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-muted-foreground">Total Services</p>
            <p className="text-lg font-bold text-foreground">{data.data.length}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-muted-foreground">Total Feedback</p>
            <p className="text-lg font-bold text-foreground">
              {data.data.reduce((sum, item) => sum + item.totalFeedback, 0)}
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-muted-foreground">High Urgency</p>
            <p className="text-lg font-bold text-red-600 flex items-center justify-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              {data.data.reduce((sum, item) => sum + item.highUrgencyCount, 0)}
            </p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold text-foreground mb-2">{data.name}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">Performance:</span>
                            <span 
                              className="font-semibold px-2 py-0.5 rounded text-white text-xs"
                              style={{ backgroundColor: data.color }}
                            >
                              {data.performanceRating}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Satisfaction:</span>
                            <span className="font-medium">{data.satisfaction}%</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Avg Rating:</span>
                            <span className="font-medium">{data.avgRating}/5</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Sentiment:</span>
                            <span className="font-medium">{data.sentiment}%</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Total Feedback:</span>
                            <span className="font-medium">{data.totalFeedback}</span>
                          </div>
                          <div className="border-t pt-1 mt-2">
                            <div className="flex justify-between gap-2 text-xs">
                              <span className="text-green-600">✓ {data.positivePercentage}%</span>
                              <span className="text-amber-600">− {data.neutralPercentage}%</span>
                              <span className="text-red-600">✗ {data.negativePercentage}%</span>
                            </div>
                          </div>
                          {data.highUrgencyCount > 0 && (
                            <div className="flex items-center gap-2 text-red-600 text-xs pt-1 border-t">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{data.highUrgencyCount} high urgency issues</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey={dataKey} radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Legend */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {Object.entries(PERFORMANCE_COLORS).map(([rating, color]) => (
            <div key={rating} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: color }}></div>
              <span className="text-xs text-muted-foreground">{rating}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <MetricCard
      title="Service Type Performance"
      icon={BarChart3}
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
