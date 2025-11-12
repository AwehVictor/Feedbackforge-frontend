import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const PerformanceTrendsTab = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-white border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Satisfaction Trend</p>
              <p className="text-2xl font-bold text-primary">↑ 12%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Response Rate</p>
              <p className="text-2xl font-bold text-accent-foreground">85%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold text-green-600">2,547</p>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-border h-80">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Rating Distribution</h3>
          </div>
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Chart will be displayed here</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white border-border h-80">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Service Type Breakdown</h3>
          </div>
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <PieChart className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Chart will be displayed here</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

