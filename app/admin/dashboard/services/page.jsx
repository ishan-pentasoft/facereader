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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Search,
  RefreshCw,
  Plus,
  Edit,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import ServiceForm from "@/components/admin/ServiceForm";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

  const fetchServices = useCallback(
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

        const response = await fetch(`/api/admin/services?${params}`);
        const data = await response.json();

        if (data.success) {
          setServices(data.services);
          setPagination(data.pagination);
          setFilters((prev) => ({
            ...prev,
            search: data.filters.search || "",
            sortBy: data.filters.sortBy || "createdAt",
            sortOrder: data.filters.sortOrder || "desc",
          }));
        } else {
          toast.error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Error fetching services");
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit]
  );

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchServices(1, filters.search, filters.sortBy, filters.sortOrder);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search, fetchServices, filters.sortBy, filters.sortOrder]);

  // Handle delete with optimistic updates
  const handleDelete = async (serviceId) => {
    try {
      setDeleting(serviceId);

      // Optimistic update - remove from UI immediately
      const originalServices = [...services];
      setServices((prev) => prev.filter((service) => service.id !== serviceId));

      // Update pagination count optimistically
      setPagination((prev) => ({
        ...prev,
        totalCount: prev.totalCount - 1,
      }));

      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Service deleted successfully");

        // If current page is empty after deletion and not the first page, go to previous page
        if (services.length === 1 && pagination.currentPage > 1) {
          fetchServices(
            pagination.currentPage - 1,
            filters.search,
            filters.sortBy,
            filters.sortOrder
          );
        } else {
          // Refresh current page to get accurate data
          fetchServices(
            pagination.currentPage,
            filters.search,
            filters.sortBy,
            filters.sortOrder
          );
        }
      } else {
        // Revert optimistic update on error
        setServices(originalServices);
        setPagination((prev) => ({
          ...prev,
          totalCount: prev.totalCount + 1,
        }));
        toast.error(data.error || "Failed to delete service");
      }
    } catch (error) {
      // Revert optimistic update on error
      setServices((prev) =>
        [...prev, services.find((s) => s.id === serviceId)].filter(Boolean)
      );
      setPagination((prev) => ({
        ...prev,
        totalCount: prev.totalCount + 1,
      }));
      console.error("Error deleting service:", error);
      toast.error("Error deleting service");
    } finally {
      setDeleting(null);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchServices(page, filters.search, filters.sortBy, filters.sortOrder);
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

  // Format price
  const formatPrice = (price, currency) => {
    const currencyCode = currency || "CAD";
    const formattedNumber = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
    return `${currencyCode} $${formattedNumber}`;
  };

  // Truncate text
  const truncateText = (text, maxLength = 30) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Handle service creation success
  const handleServiceCreated = () => {
    setIsCreateDialogOpen(false);
    fetchServices(
      pagination.currentPage,
      filters.search,
      filters.sortBy,
      filters.sortOrder
    );
    toast.success("Service created successfully");
  };

  // Handle service update success
  const handleServiceUpdated = () => {
    setIsEditDialogOpen(false);
    setEditingService(null);
    fetchServices(
      pagination.currentPage,
      filters.search,
      filters.sortBy,
      filters.sortOrder
    );
    toast.success("Service updated successfully");
  };

  // Handle edit click
  const handleEditClick = (service) => {
    setEditingService(service);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center items-start sm:justify-between justify-start">
        <div>
          <h1 className="text-3xl font-bold">Services Management</h1>
          <p className="text-muted-foreground">
            Manage your astrology services and pricing
          </p>
        </div>
        <div className="flex gap-2 items-center p-2">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Service</DialogTitle>
                <DialogDescription>
                  Add a new astrology service to your offerings
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[70vh] overflow-y-auto pr-2">
                <ServiceForm
                  onSuccess={handleServiceCreated}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search services..."
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
              <SelectItem value="title-asc" className="cursor-pointer">
                Title A-Z
              </SelectItem>
              <SelectItem value="title-desc" className="cursor-pointer">
                Title Z-A
              </SelectItem>
              <SelectItem value="price-asc" className="cursor-pointer">
                Price Low to High
              </SelectItem>
              <SelectItem value="price-desc" className="cursor-pointer">
                Price High to Low
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              fetchServices(
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
              <TableHead className="w-20">Image</TableHead>
              <TableHead className="min-w-0">Title</TableHead>
              <TableHead className="w-32">Price</TableHead>
              <TableHead className="w-48 max-w-48">Slug</TableHead>
              <TableHead className="w-40">Date</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-12 w-12 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse w-full max-w-md"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-8 bg-muted rounded animate-pulse w-16"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  {filters.search
                    ? "No services found matching your search."
                    : "No services found. Create your first service!"}
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow
                  key={service.id}
                  className={deleting === service.id ? "opacity-50" : ""}
                >
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <DollarSign className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {truncateText(service.title, 40)}
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatPrice(service.price, service.currency)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono w-48 max-w-48">
                    <div className="truncate" title={service.slug}>
                      {service.slug}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(service.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => handleEditClick(service)}
                        disabled={deleting === service.id}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                            disabled={deleting === service.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Service</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the service{" "}
                              <strong>{service.title}</strong>? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(service.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white cursor-pointer"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the service details and pricing
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            {editingService && (
              <ServiceForm
                service={editingService}
                onSuccess={handleServiceUpdated}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setEditingService(null);
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesPage;
