import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const GlobalFilters = ({ filters, onFiltersChange }) => {
  const [showCustomDate, setShowCustomDate] = useState(false);

  const presets = [
    { label: 'Last 7 Days', value: 7 },
    { label: 'Last 30 Days', value: 30 },
    { label: 'Last 90 Days', value: 90 },
    { label: 'Custom', value: 'custom' },
  ];

  const handlePresetChange = (days) => {
    if (days === 'custom') {
      setShowCustomDate(true);
      return;
    }
    
    setShowCustomDate(false);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    onFiltersChange({
      ...filters,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      preset: days,
    });
  };

  const handleDateChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value,
      preset: 'custom',
    });
  };

  return (
    <Card className="p-4 bg-white border-border mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filters:</span>
        </div>

        {/* Date Range Presets */}
        <div className="flex gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.value}
              variant={filters.preset === preset.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetChange(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Custom Date Inputs */}
        {(showCustomDate || filters.preset === 'custom') && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="px-3 py-1.5 text-sm border border-input rounded-md bg-background"
            />
            <span className="text-sm text-muted-foreground">to</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="px-3 py-1.5 text-sm border border-input rounded-md bg-background"
            />
          </div>
        )}

        {/* Service Type Filter */}
        {/* <Select
          value={filters.serviceType || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, serviceType: value === 'all' ? null : value })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Service Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="service">Service</SelectItem>
          </SelectContent>
        </Select> */}

        {/* Branch Filter (Optional) */}
        {/* <Select
          value={filters.branch || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, branch: value === 'all' ? null : value })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            <SelectItem value="main">Main Branch</SelectItem>
            <SelectItem value="north">North Branch</SelectItem>
            <SelectItem value="south">South Branch</SelectItem>
          </SelectContent>
        </Select> */}

        {/* Reset Button */}
        {/* <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowCustomDate(false);
            onFiltersChange({
              preset: 30,
              startDate: null,
              endDate: null,
              serviceType: null,
              branch: null,
            });
          }}
        >
          Reset
        </Button> */}
      </div>
    </Card>
  );
};

