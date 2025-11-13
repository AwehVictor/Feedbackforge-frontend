import { useState } from 'react';
import { RefreshCw, Settings2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const MetricCard = ({
  title,
  icon: Icon,
  loading = false,
  error = null,
  onRefresh,
  onSettingsClick,
  hasCustomFilters = false,
  children,
  className = '',
  height = 'h-96',
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  return (
    <Card className={`p-6 bg-white border-border ${height} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-primary" />}
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          {hasCustomFilters && (
            <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
              Custom
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing || loading ? 'animate-spin' : ''}`}
              />
            </Button>
          )}
          {onSettingsClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsClick}
              className="h-8 w-8 p-0"
            >
              <Settings2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="h-[calc(100%-3rem)]">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorState error={error} onRetry={handleRefresh} />
        ) : (
          children
        )}
      </div>
    </Card>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-4 h-full flex flex-col justify-center">
    <Skeleton className="h-12 w-3/4 mx-auto" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-24 w-5/6 mx-auto" />
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center">
      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive opacity-50" />
      <p className="text-sm text-muted-foreground mb-4">
        {error || 'Failed to load data'}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  </div>
);

