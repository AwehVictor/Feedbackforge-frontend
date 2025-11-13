import { useState } from 'react';
import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = [
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800 border-green-300' },
];

export const StatusUpdateDialog = ({ open, onOpenChange, currentStatus, onSave, loading }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const handleSave = () => {
    if (selectedStatus && selectedStatus !== currentStatus) {
      onSave(selectedStatus);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Feedback Status</DialogTitle>
          <DialogDescription>
            Select a new status for this feedback submission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all hover:shadow-md',
                selectedStatus === status.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50',
                status.color
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{status.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {status.value === 'in_progress' && 'Mark as currently being worked on'}
                    {status.value === 'resolved' && 'Issue has been resolved'}
                  </p>
                </div>
                {selectedStatus === status.value && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || selectedStatus === currentStatus}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

