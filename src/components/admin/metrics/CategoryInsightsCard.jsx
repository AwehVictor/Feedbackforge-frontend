import { useState, useEffect } from 'react';
import { Tag, TrendingUp, TrendingDown, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { MetricCard } from '../MetricCard';
import { feedbackService } from '@/services/feedbackService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const CategoryInsightsCard = ({ filters, customFilters = null }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'count', direction: 'desc' });

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
        minCount: 1,
      };

      const response = await feedbackService.getCategoryInsights(params);
      setData(response);
    } catch (err) {
      console.error('Error fetching category insights:', err);
      setError(err.response?.data?.message || 'Failed to load category insights data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeFilters.startDate, activeFilters.endDate, activeFilters.serviceType, activeFilters.branch]);

  const formatCategoryName = (category) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getSentimentBadge = (sentiment) => {
    const badges = {
      positive: { bg: 'bg-green-100', text: 'text-green-800', icon: <TrendingUp className="w-3 h-3" /> },
      negative: { bg: 'bg-red-100', text: 'text-red-800', icon: <TrendingDown className="w-3 h-3" /> },
      neutral: { bg: 'bg-gray-100', text: 'text-gray-800', icon: null },
    };
    const badge = badges[sentiment] || badges.neutral;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon}
        {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
      </span>
    );
  };

  const getSentimentScoreColor = (score) => {
    if (score >= 70) return 'text-green-600 font-semibold';
    if (score >= 50) return 'text-amber-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  // Don't render card if no data
  if (!loading && !error && (!data?.data || data.data.length === 0)) {
    return null;
  }

  const getSortedData = () => {
    if (!data?.data) return [];
    
    const sorted = [...data.data].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (sortConfig.key === 'category') {
        aVal = formatCategoryName(a.category);
        bVal = formatCategoryName(b.category);
      }
      
      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
    
    return sorted;
  };

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const renderContent = () => {
    if (!data?.data || data.data.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Tag className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No category insights available</p>
          </div>
        </div>
      );
    }

    const sortedData = getSortedData();
    const totalMentions = data.data.reduce((sum, item) => sum + item.count, 0);
    const avgRating = (data.data.reduce((sum, item) => sum + (item.avgRating * item.count), 0) / totalMentions).toFixed(2);
    const totalHighUrgency = data.data.reduce((sum, item) => sum + item.highUrgencyCount, 0);

    return (
      <div className="h-full flex flex-col">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-muted-foreground">Total Categories</p>
            <p className="text-lg font-bold text-foreground">{data.data.length}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-muted-foreground">Total Mentions</p>
            <p className="text-lg font-bold text-foreground">{totalMentions}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-muted-foreground">High Urgency</p>
            <p className="text-lg font-bold text-red-600 flex items-center justify-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              {totalHighUrgency}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-1">
                    Category {renderSortIcon('category')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 text-center"
                  onClick={() => handleSort('count')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Count {renderSortIcon('count')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 text-center"
                  onClick={() => handleSort('avgRating')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Avg Rating {renderSortIcon('avgRating')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 text-center"
                  onClick={() => handleSort('avgSentimentScore')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Sentiment {renderSortIcon('avgSentimentScore')}
                  </div>
                </TableHead>
                <TableHead className="text-center">Dominant</TableHead>
                {/* <TableHead className="text-center">Distribution</TableHead> */}
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 text-center"
                  onClick={() => handleSort('highUrgencyCount')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Urgency {renderSortIcon('highUrgencyCount')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      {formatCategoryName(item.category)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold">{item.count}</span>
                      <span className="text-xs text-muted-foreground">
                        {((item.count / totalMentions) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-semibold">{item.avgRating}</span>
                      <span className="text-amber-500">★</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={getSentimentScoreColor(item.avgSentimentScore)}>
                      {item.avgSentimentScore}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {getSentimentBadge(item.dominantSentiment)}
                  </TableCell>
                  {/* <TableCell>
                    <div className="flex items-center gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">✓</span>
                        <span>{item.positivePercentage}%</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">−</span>
                        <span>{item.neutralCount}</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1">
                        <span className="text-red-600">✗</span>
                        <span>{item.negativePercentage}%</span>
                      </div>
                    </div>
                  </TableCell> */}
                  <TableCell className="text-center">
                    {item.highUrgencyCount > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        {item.highUrgencyCount}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">−</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Top Issues Highlight */}
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs font-semibold text-amber-900 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            Top Complaint Areas:
          </p>
          <div className="flex flex-wrap gap-2">
            {sortedData
              .filter(item => item.dominantSentiment === 'negative')
              .slice(0, 3)
              .map((item, idx) => (
                <span key={idx} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                  {formatCategoryName(item.category)} ({item.count})
                </span>
              ))}
            {sortedData.filter(item => item.dominantSentiment === 'negative').length === 0 && (
              <span className="text-xs text-green-600">No major complaints! 🎉</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <MetricCard
      title="Category Insights"
      icon={Tag}
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
