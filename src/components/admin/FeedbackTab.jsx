import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Star, LayoutGrid, LayoutList, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { feedbackService } from '../../services/feedbackService';
import { toast } from 'sonner';
import { FeedbackGrid } from './FeedbackGrid';
import { FeedbackList } from './FeedbackList';

export const FeedbackTab = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loadMoreRef = useRef(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchFeedbacks(1, true); // Reset to page 1 when view changes
  }, [view]);

  // Infinite scroll observer for grid view
  useEffect(() => {
    if (view !== 'grid') return;

    const target = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetchingMore && !loading && hasMore) {
          handleLoadMore();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0,
      }
    );

    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [view, isFetchingMore, loading, hasMore, currentPage]);

  const fetchFeedbacks = async (page = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
        setFeedbacks([]);
      } else {
        setIsFetchingMore(true);
      }

      // Set limit based on view: 9 for grid, 10 for list
      const limit = view === 'grid' ? 9 : 10;

      const response = await feedbackService.getAllFeedback({
        page,
        limit,
      });
      
      console.log('Feedback API response:', response);

      // Handle the nested response structure: response.data.data.feedbacks
      let feedbackArray = [];
      
      if (response?.data?.data?.feedbacks && Array.isArray(response.data.data.feedbacks)) {
        feedbackArray = response.data.data.feedbacks;
      } else if (response?.data?.feedbacks && Array.isArray(response.data.feedbacks)) {
        feedbackArray = response.data.feedbacks;
      } else if (Array.isArray(response?.data)) {
        feedbackArray = response.data;
      } else if (Array.isArray(response)) {
        feedbackArray = response;
      }

      console.log('Parsed feedbacks array:', feedbackArray);

      // For grid view (infinite scroll), append; for list view (pagination), replace
      if (view === 'grid' && !reset) {
        setFeedbacks((prev) => [...prev, ...feedbackArray]);
      } else {
        setFeedbacks(feedbackArray);
      }

      // Update pagination state
      // Note: response.results is the count of items in THIS page, not total in DB
      const itemsInThisPage = feedbackArray.length;
      setHasMore(itemsInThisPage === limit); // If we got a full page, there might be more
      setCurrentPage(page);
      
      // Calculate totalPages: If we got a full page, assume there might be at least one more
      // This is a workaround since the API doesn't return total count
      if (itemsInThisPage === limit) {
        // There might be more pages
        setTotalPages(page + 1); // At least one more page
      } else {
        // This is the last page
        setTotalPages(page);
      }
      
      // For total results, we can only show an estimate
      // Total = (previous pages * limit) + items in current page
      const estimatedTotal = ((page - 1) * limit) + itemsInThisPage;
      setTotalResults(estimatedTotal);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error(error.response?.data?.message || 'Failed to load feedbacks');
      setFeedbacks([]);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (view === 'grid' && hasMore && !isFetchingMore) {
      fetchFeedbacks(currentPage + 1, false);
    }
  };

  const handlePageChange = (page) => {
    fetchFeedbacks(page, false);
  };

  const safeFeedbacks = Array.isArray(feedbacks) ? feedbacks : [];

  // Calculate stats safely
  const avgRating =
    safeFeedbacks.length > 0
      ? (safeFeedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / safeFeedbacks.length).toFixed(1)
      : '0.0';
  const excellentCount = safeFeedbacks.filter((f) => f.rating === 5).length;
  const poorCount = safeFeedbacks.filter((f) => f.rating === 1).length;
  const pendingCount = safeFeedbacks.filter((f) => f.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading feedbacks...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex font-semibold">
            <div className="text-muted-foreground mr-2">
              {view === 'grid' ? 'Showing:' : `Page ${currentPage}:`}
            </div>
            <div className="text-foreground">
              {view === 'grid' ? `${safeFeedbacks.length} feedback` : `Page ${currentPage} of ${totalPages}`}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView('list')}
            className={view === 'list' ? 'border-primary' : ''}
          >
            <LayoutList className="h-4 w-4" color={view === 'list' ? '#6A0F49' : 'currentColor'} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setView('grid')}
            className={view === 'grid' ? 'border-primary' : ''}
          >
            <LayoutGrid className="h-4 w-4" color={view === 'grid' ? '#6A0F49' : 'currentColor'} />
          </Button>
        </div>
      </div>

     

      {/* Divider */}
      <div className="border-b border-border" />

      {/* Content Views */}
      {safeFeedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-lg border-2 border-dashed border-border">
          <MessageSquare className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Feedback Yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            There are no feedback submissions at the moment. Check back later or encourage customers to submit feedback.
          </p>
        </div>
      ) : view === 'grid' ? (
        <>
          <FeedbackGrid feedbacks={safeFeedbacks} isFetchingMore={isFetchingMore} />
          <div ref={loadMoreRef} className="flex items-center justify-center p-4" style={{ minHeight: '100px' }}>
            {isFetchingMore && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading more...</p>
              </div>
            )}
            {!isFetchingMore && !hasMore && safeFeedbacks.length > 0 && (
              <p className="text-sm text-muted-foreground">No more feedback to load</p>
            )}
          </div>
        </>
      ) : (
        <FeedbackList 
          feedbacks={safeFeedbacks} 
          isLoading={false}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
