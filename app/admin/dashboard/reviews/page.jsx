"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [filters, setFilters] = useState({
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const fetchReviews = useCallback(
    async (
      page = 1,
      searchTerm = "",
      sortBy = "createdAt",
      sortOrder = "desc"
    ) => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          limit: pagination.limit.toString(),
          sortBy,
          sortOrder,
          ...(searchTerm && { search: searchTerm }),
        });

        const response = await fetch(`/api/admin/reviews?${params}`);
        const data = await response.json();

        if (data.success) {
          setReviews(data.reviews);
          setPagination(data.pagination);
          setFilters((prev) => ({
            ...prev,
            search: data.filters.search || "",
            sortBy: data.filters.sortBy || "createdAt",
            sortOrder: data.filters.sortOrder || "desc",
          }));
        } else {
          toast.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Error fetching reviews");
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit]
  );

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchReviews(1, filters.search, filters.sortBy, filters.sortOrder);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search, fetchReviews, filters.sortBy, filters.sortOrder]);

  // Handle delete with optimistic updates
  const handleDelete = async (reviewId) => {
    try {
      setDeleting(reviewId);

      // Optimistic update - remove from UI immediately
      const originalReviews = [...reviews];
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));

      // Update pagination count optimistically
      setPagination((prev) => ({
        ...prev,
        totalCount: prev.totalCount - 1,
      }));

      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Review deleted successfully");

        // If current page is empty after deletion and not the first page, go to previous page
        if (reviews.length === 1 && pagination.currentPage > 1) {
          fetchReviews(
            pagination.currentPage - 1,
            filters.search,
            filters.sortBy,
            filters.sortOrder
          );
        } else {
          // Refresh current page to get accurate data
          fetchReviews(
            pagination.currentPage,
            filters.search,
            filters.sortBy,
            filters.sortOrder
          );
        }
      } else {
        // Revert optimistic update on error
        setReviews(originalReviews);
        setPagination((prev) => ({
          ...prev,
          totalCount: prev.totalCount + 1,
        }));
        toast.error(data.error || "Failed to delete review");
      }
    } catch (error) {
      // Revert optimistic update on error
      setReviews((prev) =>
        [...prev, reviews.find((r) => r.id === reviewId)].filter(Boolean)
      );
      setPagination((prev) => ({
        ...prev,
        totalCount: prev.totalCount + 1,
      }));
      console.error("Error deleting review:", error);
      toast.error("Error deleting review");
    } finally {
      setDeleting(null);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchReviews(page, filters.search, filters.sortBy, filters.sortOrder);
  };

  // Handle sort change
  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split("-");
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Truncate text
  const truncateText = (text, maxLength = 50) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center items-start sm:justify-between justify-start">
        <div>
          <h1 className="text-3xl font-bold">Reviews Management</h1>
          <p className="text-muted-foreground">
            Manage customer reviews and testimonials
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {pagination.totalCount} Total Reviews
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search reviews..."
            value={filters.search || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-fit">
          <Select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-full sm:w-48 cursor-pointer">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc" className="cursor-pointer">
                Newest First
              </SelectItem>
              <SelectItem value="createdAt-asc" className="cursor-pointer">
                Oldest First
              </SelectItem>
              <SelectItem value="name-asc" className="cursor-pointer">
                Name A-Z
              </SelectItem>
              <SelectItem value="name-desc" className="cursor-pointer">
                Name Z-A
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              fetchReviews(
                pagination.currentPage,
                filters.search,
                filters.sortBy,
                filters.sortOrder
              )
            }
            className="cursor-pointer"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse w-full max-w-md"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-8 bg-muted rounded animate-pulse w-8"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  {filters.search
                    ? "No reviews found matching your search."
                    : "No reviews found."}
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow
                  key={review.id}
                  className={deleting === review.id ? "opacity-50" : ""}
                >
                  <TableCell className="font-medium">
                    <Image
                      src={
                        review.image || "https://avatar.iran.liara.run/public"
                      }
                      alt="Review Image"
                      width={50}
                      height={50}
                      className="rounded-full object-contain w-15 h-15"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{review.name}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="text-sm">{truncateText(review.review)}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                          disabled={deleting === review.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Review</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the review by{" "}
                            <strong>{review.name}</strong>? This action cannot
                            be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(review.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white cursor-pointer"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                className={
                  pagination.hasPreviousPage
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }
              />
            </PaginationItem>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={page === pagination.currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className={
                  pagination.hasNextPage
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ReviewsPage;
