import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { AlertTriangle, Shield, Clock, TrendingUp, Tag, Smile } from 'lucide-react';
import { useState } from 'react';

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

const formatCategoryName = (category) => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const FeedbackList = ({ 
  feedbacks, 
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) => {
  // Use backend pagination - no client-side slicing
  const currentFeedbacks = feedbacks;

  const handlePageClick = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div>
      <div className="rounded-md border bg-white w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-6">Customer Information</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Emotions</TableHead>
              {/* <TableHead>Alerts</TableHead> */}
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-40 bg-muted animate-pulse rounded" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-6 w-8 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-64 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : currentFeedbacks.map((feedback) => (
                  <TableRow
                    key={feedback._id || feedback.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {feedback.customerName}
                        </p>
                        <p className="text-sm text-muted-foreground">{feedback.email}</p>
                        <p className="text-sm text-muted-foreground">{feedback.phone}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm">{feedback.serviceType}</p>
                     
                    </TableCell>

                    <TableCell>
                      {feedback.branch && (
                        <p className="text-sm">{feedback.branch}</p>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getRatingEmoji(feedback.rating)}</span>
                        <span className="text-sm font-medium">{feedback.rating}/5</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
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
                        {feedback.sentimentScore !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            Score: {feedback.sentimentScore}%
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border',
                            getUrgencyColor(feedback.urgency)
                          )}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {feedback.urgency}
                        </span>
                        {feedback.isOverdue && (
                          <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Overdue
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 max-w-[180px]">
                        {/* Categories */}
                        {feedback.categories && feedback.categories.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {feedback.categories.slice(0, 2).map((category, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-xs"
                              >
                                <Tag className="w-2.5 h-2.5" />
                                {formatCategoryName(category)}
                              </span>
                            ))}
                            {feedback.categories.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{feedback.categories.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 max-w-[180px]">
                        {/* Emotions */}
                        {feedback.emotions && feedback.emotions.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {feedback.emotions.slice(0, 2).map((emotion, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-pink-50 text-pink-700 border border-pink-200 rounded text-xs capitalize"
                              >
                                <Smile className="w-2.5 h-2.5" />
                                {emotion}
                              </span>
                            ))}
                            {feedback.emotions.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{feedback.emotions.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>

                        {/* Trustscore is not being used for now */}
                    {/* <TableCell>
                      <div className="space-y-1">
                        {feedback.trustScore && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-300 rounded text-xs">
                            <Shield className="w-3 h-3" />
                            {feedback.trustScore}%
                          </span>
                        )}
                        
                        {feedback.needsImmediateAction && (
                          <span className="block text-xs text-orange-600 font-semibold animate-pulse">
                            ⚠️ Action Needed
                          </span>
                        )}

                        {!feedback.needsImmediateAction && (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell> */}

                    <TableCell>
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium border capitalize',
                          getStatusColor(feedback.status)
                        )}
                      >
                        {feedback.status.replace('_', ' ')}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm whitespace-nowrap">
                          {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        {feedback.daysSinceSubmission > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {feedback.daysSinceSubmission}d ago
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-xs text-muted-foreground">
                        {feedback.referenceNumber || '-'}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center p-4 bg-muted/30 border-t">
            <Pagination>
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePreviousPage}
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {currentPage > 3 && (
                  <>
                    <PaginationItem className="hidden md:block">
                      <PaginationLink
                        onClick={() => handlePageClick(1)}
                        isActive={false}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="hidden md:block">
                      <PaginationEllipsis />
                    </PaginationItem>
                  </>
                )}

                {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                  .filter((p) => p >= 1 && p <= totalPages)
                  .map((p) => (
                    <PaginationItem key={p} className="hidden md:block">
                      <PaginationLink
                        onClick={() => handlePageClick(p)}
                        isActive={currentPage === p}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                {currentPage < totalPages - 2 && (
                  <>
                    <PaginationItem className="hidden md:block">
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem className="hidden md:block">
                      <PaginationLink
                        onClick={() => handlePageClick(totalPages)}
                        isActive={false}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={handleNextPage}
                    className={
                      currentPage >= totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

