import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Mail, Phone, Calendar, MapPin, Briefcase, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getRatingEmoji = (rating) => {
  const emojis = ['😞', '😕', '😐', '😊', '🤩'];
  return emojis[rating - 1] || '⭐';
};

const truncateText = (text, maxLength = 120) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const FeedbackGrid = ({ feedbacks, isFetchingMore }) => {
  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6 my-4">
        {feedbacks.map((feedback) => (
          <Card
            key={feedback._id || feedback.id}
            className="h-full shadow-md border border-border hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {feedback.customerName}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-3xl">{getRatingEmoji(feedback.rating)}</div>
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-xs font-medium border',
                      getStatusColor(feedback.status)
                    )}
                  >
                    {feedback.status}
                  </span>
                </div>
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

