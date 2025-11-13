import { useState, useEffect } from 'react';
import { Building2, Trophy, Medal, Award, TrendingUp, AlertTriangle, Star } from 'lucide-react';
import { MetricCard } from '../MetricCard';
import { feedbackService } from '@/services/feedbackService';

export const BranchComparisonCard = ({ filters, customFilters = null }) => {
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

      const response = await feedbackService.getBranchComparison(params);
      setData(response);
    } catch (err) {
      console.error('Error fetching branch comparison:', err);
      setError(err.response?.data?.message || 'Failed to load branch comparison data');
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

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-amber-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
          </div>
        );
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-blue-500';
    if (score >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPerformanceGrade = (score) => {
    if (score >= 80) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 70) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 60) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 50) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (score >= 40) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const renderContent = () => {
    if (!data?.data || data.data.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No branch data available</p>
            <p className="text-sm mt-2">Branch comparison will appear here</p>
          </div>
        </div>
      );
    }

    const totalFeedback = data.data.reduce((sum, branch) => sum + branch.totalFeedback, 0);
    const avgPerformance = (data.data.reduce((sum, branch) => sum + branch.performanceScore, 0) / data.data.length).toFixed(1);
    const topBranch = data.data[0];

    return (
      <div className="h-full flex flex-col">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-muted-foreground">Total Branches</p>
            <p className="text-2xl font-bold text-foreground">{data.data.length}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-muted-foreground">Total Feedback</p>
            <p className="text-2xl font-bold text-foreground">{totalFeedback}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-muted-foreground">Avg Performance</p>
            <p className="text-2xl font-bold text-foreground">{avgPerformance}</p>
          </div>
        </div>

        {/* Top Performer Highlight */}
        {topBranch && (
          <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-lg border-2 border-amber-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-amber-500" />
                <div>
                  <p className="text-xs text-amber-700 font-medium">🏆 Top Performer</p>
                  <p className="text-lg font-bold text-foreground">{topBranch.branch}</p>
                  <p className="text-xs text-muted-foreground">
                    {topBranch.totalFeedback} feedback • {topBranch.avgRating}★ rating
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-amber-600">{topBranch.performanceScore}</p>
                <p className="text-xs text-amber-700 font-medium">Performance Score</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="flex-1 overflow-auto space-y-2">
          {data.data.map((branch, index) => {
            const performanceGrade = getPerformanceGrade(branch.performanceScore);
            const isTopThree = index < 3;

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  isTopThree
                    ? 'bg-gradient-to-r from-gray-50 to-white border-gray-300'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {getRankIcon(index)}
                  </div>

                  {/* Branch Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <p className="font-semibold text-foreground truncate">
                        {branch.branch}
                      </p>
                      {branch.highUrgencyCount > 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          {branch.highUrgencyCount}
                        </span>
                      )}
                    </div>

                    {/* Metrics Row */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="font-medium">{branch.avgRating}</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{branch.avgSentimentScore}% sentiment</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div>
                        <span className="text-green-600">✓ {branch.positivePercentage}%</span>
                        {' • '}
                        <span className="text-red-600">✗ {branch.negativePercentage}%</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div>
                        <span className="font-medium">{branch.totalFeedback}</span> feedback
                      </div>
                    </div>
                  </div>

                  {/* Performance Score & Grade */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Grade Badge */}
                    <div className={`px-3 py-2 rounded-lg ${performanceGrade.bg}`}>
                      <p className={`text-xl font-bold ${performanceGrade.color}`}>
                        {performanceGrade.grade}
                      </p>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getPerformanceColor(branch.performanceScore) }}></div>
                        <p className="text-2xl font-bold text-foreground">
                          {branch.performanceScore}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">score</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      branch.performanceScore >= 70 ? 'bg-green-500' :
                      branch.performanceScore >= 50 ? 'bg-blue-500' :
                      branch.performanceScore >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(branch.performanceScore, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Legend */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Performance Grading:</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded"></span>
              <span>A+/A (70-100)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-500 rounded"></span>
              <span>B/C (50-69)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-500 rounded"></span>
              <span>D (30-49)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded"></span>
              <span>F (&lt;30)</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Score calculated: Sentiment (70%) + Rating (30%)
          </p>
        </div>
      </div>
    );
  };

  return (
    <MetricCard
      title="Branch Comparison"
      icon={Building2}
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
