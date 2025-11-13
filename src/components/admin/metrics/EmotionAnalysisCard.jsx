import { useState, useEffect } from 'react';
import { Smile, TrendingUp, Star } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { MetricCard } from '../MetricCard';
import { feedbackService } from '@/services/feedbackService';

const EMOTION_CONFIG = {
  happy: { emoji: '😊', color: '#22c55e', label: 'Happy' },
  satisfied: { emoji: '😌', color: '#84cc16', label: 'Satisfied' },
  grateful: { emoji: '🙏', color: '#10b981', label: 'Grateful' },
  excited: { emoji: '🤩', color: '#06b6d4', label: 'Excited' },
  impressed: { emoji: '😲', color: '#3b82f6', label: 'Impressed' },
  confused: { emoji: '😕', color: '#f59e0b', label: 'Confused' },
  concerned: { emoji: '😟', color: '#f97316', label: 'Concerned' },
  worried: { emoji: '😰', color: '#fb923c', label: 'Worried' },
  frustrated: { emoji: '😤', color: '#ef4444', label: 'Frustrated' },
  disappointed: { emoji: '😞', color: '#dc2626', label: 'Disappointed' },
  angry: { emoji: '😠', color: '#991b1b', label: 'Angry' },
  anxious: { emoji: '😨', color: '#b91c1c', label: 'Anxious' },
};

export const EmotionAnalysisCard = ({ filters, customFilters = null }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('pie'); // 'pie' or 'bar'

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

      const response = await feedbackService.getEmotionAnalysis(params);
      setData(response);
    } catch (err) {
      console.error('Error fetching emotion analysis:', err);
      setError(err.response?.data?.message || 'Failed to load emotion analysis data');
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

  const getEmotionConfig = (emotion) => {
    return EMOTION_CONFIG[emotion.toLowerCase()] || { 
      emoji: '😐', 
      color: '#9ca3af', 
      label: emotion.charAt(0).toUpperCase() + emotion.slice(1) 
    };
  };

  const renderContent = () => {
    if (!data?.data || data.data.length === 0) {
      return null;
    }

    const chartData = data.data.map(item => {
      const config = getEmotionConfig(item.emotion);
      return {
        name: config.label,
        value: item.count,
        percentage: item.percentage,
        color: config.color,
        emoji: config.emoji,
        avgRating: item.avgRating,
        avgSentimentScore: item.avgSentimentScore,
        positiveCount: item.positiveCount,
        negativeCount: item.negativeCount,
      };
    });

    const topEmotions = chartData.slice(0, 5);
    const { totalEmotions, uniqueEmotions } = data.summary;

    // Calculate positive vs negative emotions
    const positiveEmotions = ['happy', 'satisfied', 'grateful', 'excited', 'impressed'];
    const positiveCount = data.data
      .filter(e => positiveEmotions.includes(e.emotion.toLowerCase()))
      .reduce((sum, e) => sum + e.count, 0);
    const negativeCount = totalEmotions - positiveCount;

    return (
      <div className="h-full flex flex-col">
        {/* Header with View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-primary" />
              <span className="font-medium">{uniqueEmotions} Unique Emotions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold">{totalEmotions}</span>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('pie')}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                viewMode === 'pie'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pie Chart
            </button>
           
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 font-medium">Positive Emotions</p>
            <p className="text-2xl font-bold text-green-600">{positiveCount}</p>
            <p className="text-xs text-green-600">{((positiveCount / totalEmotions) * 100).toFixed(1)}%</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-700 font-medium">Negative Emotions</p>
            <p className="text-2xl font-bold text-red-600">{negativeCount}</p>
            <p className="text-xs text-red-600">{((negativeCount / totalEmotions) * 100).toFixed(1)}%</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-muted-foreground">Avg Sentiment</p>
            <p className="text-2xl font-bold text-foreground">
              {(data.data.reduce((sum, e) => sum + e.avgSentimentScore * e.count, 0) / totalEmotions).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 min-h-0 mb-4">
          
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{data.emoji}</span>
                            <p className="font-semibold text-foreground">{data.name}</p>
                          </div>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Count: </span>
                            <span className="font-bold">{data.value}</span>
                            <span className="text-muted-foreground"> ({data.percentage}%)</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          
        </div>

        {/* Top Emotions */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground mb-2">Top 5 Emotions:</p>
          <div className="grid grid-cols-5 gap-2">
            {topEmotions.map((emotion, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border-2 text-center transition-all hover:shadow-md"
                style={{ 
                  backgroundColor: `${emotion.color}10`, 
                  borderColor: emotion.color 
                }}
              >
                <div className="text-3xl mb-1">{emotion.emoji}</div>
                <p className="text-xs font-semibold text-foreground">{emotion.name}</p>
                <p className="text-lg font-bold" style={{ color: emotion.color }}>
                  {emotion.value}
                </p>
                <p className="text-xs text-muted-foreground">{emotion.percentage}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-purple-900">Emotional Insights</p>
              <p className="text-xs text-purple-700 mt-1">
                {positiveCount > negativeCount 
                  ? `Great news! ${((positiveCount / totalEmotions) * 100).toFixed(0)}% of customers express positive emotions. Keep delivering excellent experiences!`
                  : `${((negativeCount / totalEmotions) * 100).toFixed(0)}% of customers express negative emotions. Review feedback and implement improvements to boost satisfaction.`
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
      title="Emotion Analysis"
      icon={Smile}
      loading={loading}
      error={error}
      onRefresh={fetchData}
      hasCustomFilters={customFilters !== null}
      height="h-[650px]"
    >
      {renderContent()}
    </MetricCard>
  );
};
