import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Mail, Phone, Calendar, MapPin, Briefcase, Star, AlertTriangle, Shield, Clock, TrendingUp, Tag, Smile, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusUpdateDialog } from './StatusUpdateDialog';
import { feedbackService } from '@/services/feedbackService';
import { toast } from 'sonner';

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getSentimentColor = (sentiment) => {
  const colors = {
    positive: 'bg-green-100 text-green-800 border-green-300',
    neutral: 'bg-gray-100 text-gray-800 border-gray-300',
    negative: 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[sentiment?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getUrgencyColor = (urgency) => {
  const colors = {
    critical: 'bg-red-600 text-white border-red-700',
    high: 'bg-orange-500 text-white border-orange-600',
    medium: 'bg-yellow-500 text-white border-yellow-600',
    low: 'bg-green-500 text-white border-green-600',
  };
  return colors[urgency?.toLowerCase()] || 'bg-gray-500 text-white border-gray-600';
};

const getRatingEmoji = (rating) => {
  const emojis = ['😞', '😕', '😐', '😊', '🤩'];
  return emojis[rating - 1] || '⭐';
};

const truncateText = (text, maxLength = 120) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const formatCategoryName = (category) => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const FeedbackGrid = ({ feedbacks, isFetchingMore, onRefresh }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [updating, setUpdating] = useState(false);

  const handleEditClick = (feedback, e) => {
    e.stopPropagation();
    setSelectedFeedback(feedback);
    setDialogOpen(true);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedFeedback) return;

    try {
      setUpdating(true);
      await feedbackService.updateFeedbackStatus(selectedFeedback._id || selectedFeedback.id, newStatus);
      
      toast.success('Status updated successfully!', {
        description: `Feedback status changed to ${newStatus.replace('_', ' ')}`,
      });
      
      setDialogOpen(false);
      setSelectedFeedback(null);
      
      // Refetch the feedback list
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status', {
        description: error.response?.data?.message || 'Please try again later',
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6 my-4">
        {feedbacks.map((feedback) => (
          <Card
            key={feedback._id || feedback.id}
            className="h-full shadow-md border border-border hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {feedback.customerName}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(feedback.createdAt).toLocaleDateString()}
                    {feedback.daysSinceSubmission > 0 && (
                      <span className="ml-2 text-xs">
                        ({feedback.daysSinceSubmission}d ago)
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-3xl">{getRatingEmoji(feedback.rating)}</div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
                        getStatusColor(feedback.status)
                      )}
                    >
                      {feedback.status.replace('_', ' ')}
                    </span>
                    <button
                      onClick={(e) => handleEditClick(feedback, e)}
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      title="Update status"
                    >
                      <Pencil className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Important Badges Row */}
              <div className="flex flex-wrap gap-2 mb-2">
                {/* Sentiment Badge */}
                {feedback.sentiment && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border',
                      getSentimentColor(feedback.sentiment)
                    )}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {feedback.sentiment}
                  </span>
                )}

                {/* Urgency Badge */}
                  <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border',
                    getUrgencyColor(feedback.urgency)
                  )}
                >
                  <AlertTriangle className="w-3 h-3" />
                  {feedback.urgency}
                </span>
                {/* )} */}

                {/* Trust Score */}
                {/* {feedback.trustScore && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded text-xs font-medium">
                    <Shield className="w-3 h-3" />
                    {feedback.trustScore}%
                  </span>
                )} */}

                {/* Overdue Badge */}
                {feedback.isOverdue && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 border border-red-300 rounded text-xs font-bold">
                    <Clock className="w-3 h-3" />
                    Overdue
                  </span>
                )}

                {/* Needs Immediate Action */}
                {feedback.needsImmediateAction && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 border border-orange-300 rounded text-xs font-bold animate-pulse">
                    <AlertTriangle className="w-3 h-3" />
                    Action Needed
                  </span>
                )}

                {/* Sentiment Score */}
                {feedback.sentimentScore !== undefined && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded text-xs font-medium">
                    Score: {feedback.sentimentScore}%
                  </span>
                )}
              </div>

                <div className="flex flex-wrap gap-2 items-center">

              {/* Categories */}
              {feedback.categories && feedback.categories.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {feedback.categories.slice(0, 3).map((category, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs"
                    >
                      <Tag className="w-3 h-3" />
                      {formatCategoryName(category)}
                    </span>
                  ))}
                  {feedback.categories.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{feedback.categories.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Emotions */}
              {feedback.emotions && feedback.emotions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {feedback.emotions.slice(0, 3).map((emotion, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-pink-50 text-pink-700 border border-pink-200 rounded-full text-xs capitalize"
                    >
                      <Smile className="w-3 h-3" />
                      {emotion}
                    </span>
                  ))}
                  {feedback.emotions.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{feedback.emotions.length - 3} more
                    </span>
                  )}
                </div>
              )}
                </div>
              
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <div className="flex gap-2 items-center min-w-0">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-xs text-foreground font-medium truncate">
                    {feedback.email}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-xs text-foreground font-medium">
                    {feedback.phone}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-xs text-foreground font-medium">
                    {feedback.serviceType}
                  </p>
                </div>

                {feedback.branch && (
                  <div className="flex gap-2 items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <p className="text-xs text-foreground font-medium">
                      {feedback.branch}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-sm text-foreground leading-relaxed">
                  {truncateText(feedback.comment)}
                </p>
              </div>

              {feedback.referenceNumber && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    Ref: {feedback.referenceNumber}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Update Dialog */}
      <StatusUpdateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentStatus={selectedFeedback?.status}
        onSave={handleStatusUpdate}
        loading={updating}
      />

      {isFetchingMore && (
        <div className="grid md:grid-cols-3 gap-6 my-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="h-full shadow-md border border-border">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                    <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-20 w-full bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

