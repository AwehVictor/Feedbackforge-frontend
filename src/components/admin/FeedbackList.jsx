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
import { useState } from 'react';

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
                        <p className="text-xs">{feedback.branch}</p>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getRatingEmoji(feedback.rating)}</span>
                        <span className="text-sm font-medium">{feedback.rating}/5</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium border capitalize',
                          getStatusColor(feedback.status)
                        )}
                      >
                        {feedback.status}
                      </span>
                    </TableCell>

                 

                    <TableCell>
                      <p className="text-sm whitespace-nowrap">
                        {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
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

