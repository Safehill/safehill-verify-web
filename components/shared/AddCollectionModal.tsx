'use client';

import { Button } from '@/components/shared/button';
import { Input } from '@/components/shared/input';
import Modal from '@/components/shared/modal';
import { useSearchAllCollections } from '@/lib/hooks/use-collections';
import { useAuth } from '@/lib/auth/auth-context';
import { convertToAuthenticatedUser } from '@/lib/utils';
import {
  Search,
  Eye,
  Lock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { CollectionOutputDTO } from '@/lib/api/models/dto/Collection';

interface CollectionSearchResult extends CollectionOutputDTO {
  ownerName?: string;
}

interface AddCollectionModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

// Dynamic results per page based on available space
const calculateResultsPerPage = (): number => {
  if (typeof window === 'undefined') {
    return 4;
  }

  const viewportHeight = window.innerHeight;
  const modalPadding = 32; // Reduced padding
  const searchBarHeight = 120; // Taller search bar
  const headerHeight = 40; // Header height
  const footerHeight = 48; // Footer height
  const resultItemHeight = 100; // Height per result

  const availableHeight =
    viewportHeight -
    modalPadding -
    searchBarHeight -
    headerHeight -
    footerHeight;
  const maxResults = Math.floor(availableHeight / resultItemHeight);

  return Math.max(1, Math.min(4, maxResults)); // Between 1 and 4 results
};

export default function AddCollectionModal({
  showModal,
  setShowModal,
}: AddCollectionModalProps) {
  const { authedSession } = useAuth();
  const _authenticatedUser = convertToAuthenticatedUser(authedSession);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Use the proper API hook for searching
  const {
    data: searchResults = [],
    isLoading: isSearching,
    error,
  } = useSearchAllCollections(searchQuery);

  // Calculate dynamic results per page
  const resultsPerPage = calculateResultsPerPage();

  // Calculate pagination
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedResults = searchResults.slice(startIndex, endIndex);

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Recalculate results per page on window resize
  useEffect(() => {
    const handleResize = () => {
      // Force re-render by updating state
      setCurrentPage((prev) => prev);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close modal on escape key and focus input when modal opens
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);

      // Manually focus the search input after a short delay to ensure modal is fully rendered
      const focusTimer = setTimeout(() => {
        const searchInput = document.querySelector(
          'input[placeholder="Enter collection ID, name, or URL..."]'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        clearTimeout(focusTimer);
      };
    }
  }, [showModal, setShowModal]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the hook automatically
  };

  // Real-time search as user types
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleResultClick = (result: CollectionSearchResult) => {
    setShowModal(false);
    router.push(`/authed/collections/${result.id}`);
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <Eye className="h-4 w-4 text-green-500" />;
      case 'confidential':
        return <Lock className="h-4 w-4 text-orange-500" />;
      case 'not-shared':
        return <Lock className="h-4 w-4 text-gray-500" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (!showModal) {
    return null;
  }

  // Determine if we should use expanded layout
  const shouldUseExpandedLayout =
    searchQuery.trim() || isSearching || searchResults.length > 0;

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      className={`max-w-[650px] max-h-[90vh] ${
        shouldUseExpandedLayout ? 'flex flex-col min-h-0 overflow-hidden' : ''
      }`}
    >
      {/* Search Form - Full width, no padding */}
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Enter collection ID, name, or URL..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="pl-12 pr-4 py-6 text-[24px] !text-[24px] h-auto min-h-[72px] border-0 rounded-none focus:ring-0 focus:border-0"
            autoFocus
          />
        </div>
      </form>

      {/* Results - use flex layout when user has typed something or is searching */}
      <div
        className={
          shouldUseExpandedLayout ? 'flex-1 min-h-0 flex flex-col' : 'contents'
        }
      >
        {error && (
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex-shrink-0">
              Error
            </h3>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-red-600">Error searching collections</p>
                </div>
              </div>
            </div>

            {/* Footer to match results state height */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 flex-shrink-0 h-8">
              <span className="text-sm text-gray-600">Error occurred</span>
              <div className="w-20"></div> {/* Spacer to match button width */}
            </div>
          </div>
        )}

        {isSearching && (
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex-shrink-0">
              Searching
            </h3>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Searching...</p>
                </div>
              </div>
            </div>

            {/* Footer to match results state height */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 flex-shrink-0 h-8">
              <span className="text-sm text-gray-600">Searching...</span>
              <div className="w-20"></div> {/* Spacer to match button width */}
            </div>
          </div>
        )}

        {paginatedResults.length > 0 && (
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex-shrink-0">
              Found Collections ({searchResults.length} total)
            </h3>

            {/* Dynamic height container for results */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="space-y-2">
                {paginatedResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getVisibilityIcon(result.visibility)}
                        <h4 className="font-medium text-gray-900">
                          {result.name}
                        </h4>
                        {result.pricing > 0 && (
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            ${result.pricing}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {result.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        by {result.createdBy}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination - always show when there are results, even if only 1 page */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 flex-shrink-0 h-8">
              {totalPages > 1 ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 h-8 px-3"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 h-8 px-3"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-600">
                    {searchResults.length} collection
                    {searchResults.length !== 1 ? 's' : ''} found
                  </span>
                  <div className="w-20"></div>{' '}
                  {/* Spacer to match button width */}
                </>
              )}
            </div>
          </div>
        )}

        {/* No results state - show in expanded view */}
        {!isSearching &&
          !error &&
          searchResults.length === 0 &&
          searchQuery.trim() && (
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex-shrink-0">
                Search Results
              </h3>

              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-600">
                      No results for &quot;{searchQuery}&quot;
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Try entering a collection ID, name, or full URL
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer to match results state height */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 flex-shrink-0 h-8">
                <span className="text-sm text-gray-600">
                  No collections found
                </span>
                <div className="w-20"></div>{' '}
                {/* Spacer to match button width */}
              </div>
            </div>
          )}

        {/* Zero state - only show when no search query and no results */}
        {!isSearching &&
          !error &&
          searchResults.length === 0 &&
          !searchQuery.trim() && (
            <div className="p-4 text-center">
              <p className="text-gray-600">
                Start typing to search collections
              </p>
              <p className="text-sm text-gray-500 mt-1">
                You can search by ID, name, description, or full URL
              </p>
            </div>
          )}
      </div>
    </Modal>
  );
}
