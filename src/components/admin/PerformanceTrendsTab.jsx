import { useState } from 'react';
import { GlobalFilters } from './GlobalFilters';
import { SentimentOverviewCard } from './metrics/SentimentOverviewCard';
import { ServicePerformanceCard } from './metrics/ServicePerformanceCard';
import { SentimentTrendsCard } from './metrics/SentimentTrendsCard';
import { CategoryInsightsCard } from './metrics/CategoryInsightsCard';
import { EmotionAnalysisCard } from './metrics/EmotionAnalysisCard';
import { UrgencyDashboardCard } from './metrics/UrgencyDashboardCard';
import { PulseMetricsCard } from './metrics/PulseMetricsCard';
import { ActionableInsightsCard } from './metrics/ActionableInsightsCard';
import { BranchComparisonCard } from './metrics/BranchComparisonCard';

export const PerformanceTrendsTab = () => {
  // Global filters state
  const [globalFilters, setGlobalFilters] = useState(() => {
    // Initialize with last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    return {
      preset: 30,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      serviceType: null,
      branch: null,
    };
  });

  // Individual card custom filters (optional overrides)
  const [cardFilters, setCardFilters] = useState({});

  const handleFiltersChange = (newFilters) => {
    setGlobalFilters(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Global Filters */}
      <GlobalFilters 
        filters={globalFilters} 
        onFiltersChange={handleFiltersChange}
      />

      {/* Pulse Metrics - Executive Summary */}
      <div className="grid grid-cols-1 gap-6">
        <PulseMetricsCard 
          filters={globalFilters}
          customFilters={cardFilters['pulse-metrics']}
        />
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentOverviewCard 
          filters={globalFilters}
          customFilters={cardFilters['sentiment-overview']}
        />
        <ServicePerformanceCard 
          filters={globalFilters}
          customFilters={cardFilters['service-performance']}
        />
      </div>

      {/* Category Insights - Full Width */}
      <div className="grid grid-cols-1 gap-6">
        <CategoryInsightsCard 
          filters={globalFilters}
          customFilters={cardFilters['category-insights']}
        />
      </div>

      {/* Sentiment Trends - Full Width */}
      <div className="grid grid-cols-1 gap-6">
        <SentimentTrendsCard 
          filters={globalFilters}
          customFilters={cardFilters['sentiment-trends']}
        />
      </div>

      {/* Emotion Analysis - Full Width */}
      <div className="grid grid-cols-1 gap-6">
        <EmotionAnalysisCard 
          filters={globalFilters}
          customFilters={cardFilters['emotion-analysis']}
        />
      </div>

      {/* Urgency Dashboard - Full Width */}
      <div className="grid grid-cols-1 gap-6">
        <UrgencyDashboardCard 
          filters={globalFilters}
          customFilters={cardFilters['urgency-dashboard']}
        />
      </div>

      {/* Actionable Insights - Full Width */}
      {/* <div className="grid grid-cols-1 gap-6">
        <ActionableInsightsCard 
          filters={globalFilters}
          customFilters={cardFilters['actionable-insights']}
        />
      </div> */}

      {/* Branch Comparison - Full Width */}
      <div className="grid grid-cols-1 gap-6">
        <BranchComparisonCard 
          filters={globalFilters}
          customFilters={cardFilters['branch-comparison']}
        />
      </div>
    </div>
  );
};
