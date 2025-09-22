"use client";

import React, { useState, useEffect, useCallback } from "react";
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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  Search,
  RefreshCw,
  Eye,
  Edit,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  FileText,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: "",
    additionalNotes: "",
  });
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
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  const fetchAppointments = useCallback(
    async (
      page = 1,
      searchTerm = "",
      status = "all",
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
          ...(status !== "all" && { status }),
        });

        const response = await fetch(`/api/admin/appointments?${params}`);
        const data = await response.json();

        if (data.success) {
          setAppointments(data.appointments);
          setPagination(data.pagination);
          setFilters((prev) => ({
            ...prev,
            search: data.filters.search || "",
            status: data.filters.status || "all",
            sortBy: data.filters.sortBy || "createdAt",
            sortOrder: data.filters.sortOrder || "desc",
          }));
        } else {
          toast.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Error fetching appointments");
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit]
  );

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchAppointments(
          1,
          filters.search,
          filters.status,
          filters.sortBy,
          filters.sortOrder
        );
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    filters.search,
    filters.status,
    filters.sortBy,
    filters.sortOrder,
    fetchAppointments,
  ]);

  // Handle delete with optimistic updates
  const handleDelete = async (appointmentId) => {
    try {
      setDeleting(appointmentId);
      const originalAppointments = [...appointments];
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== appointmentId)
      );

      const response = await fetch(`/api/admin/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Appointment deleted successfully");
        fetchAppointments(
          pagination.currentPage,
          filters.search,
          filters.status,
          filters.sortBy,
          filters.sortOrder
        );
      } else {
        setAppointments(originalAppointments);
        toast.error(data.message || "Failed to delete appointment");
      }
    } catch (error) {
      setAppointments((prev) =>
        [...prev, appointments.find((a) => a.id === appointmentId)].filter(Boolean)
      );
      console.error("Error deleting appointment:", error);
      toast.error("Error deleting appointment");
    } finally {
      setDeleting(null);
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedAppointment) return;

    try {
      setUpdating(selectedAppointment.id);

      const response = await fetch(
        `/api/admin/appointments/${selectedAppointment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Appointment updated successfully");
        setIsEditDialogOpen(false);
        setSelectedAppointment(null);
        setEditForm({ status: "", additionalNotes: "" });
        
        fetchAppointments(
          pagination.currentPage,
          filters.search,
          filters.status,
          filters.sortBy,
          filters.sortOrder
        );
      } else {
        toast.error(data.message || "Failed to update appointment");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Error updating appointment");
    } finally {
      setUpdating(null);
    }
  };

  // Utility functions
  const handlePageChange = (page) => {
    fetchAppointments(page, filters.search, filters.status, filters.sortBy, filters.sortOrder);
  };

  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split("-");
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  const handleStatusFilterChange = (value) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOfBirth = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price, currency) => {
    const currencyCode = currency || "CAD";
    const formattedNumber = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
    return `${currencyCode} $${formattedNumber}`;
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const handleViewClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setEditForm({
      status: appointment.status,
      additionalNotes: appointment.additionalNotes || "",
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center items-start sm:justify-between justify-start">
        <div>
          <h1 className="text-3xl font-bold">Appointments Management</h1>
          <p className="text-muted-foreground">
            Manage customer appointments and bookings
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant="outline" className="text-sm">
            Total: {pagination.totalCount}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search appointments..."
            value={filters.search || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 w-full lg:w-fit flex-wrap">
          <Select
            value={filters.status}
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger className="w-full sm:w-40 cursor-pointer">
              <SelectValue placeholder="Filter by status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                All Status
              </SelectItem>
              <SelectItem value="pending" className="cursor-pointer">
                Pending
              </SelectItem>
              <SelectItem value="confirmed" className="cursor-pointer">
                Confirmed
              </SelectItem>
              <SelectItem value="completed" className="cursor-pointer">
                Completed
              </SelectItem>
              <SelectItem value="cancelled" className="cursor-pointer">
                Cancelled
              </SelectItem>
            </SelectContent>
          </Select>

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
              <SelectItem value="service-asc" className="cursor-pointer">
                Service A-Z
              </SelectItem>
              <SelectItem value="service-desc" className="cursor-pointer">
                Service Z-A
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              fetchAppointments(
                pagination.currentPage,
                filters.search,
                filters.status,
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
              <TableHead className="min-w-0">Customer</TableHead>
              <TableHead className="w-48">Service</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-40">Date Created</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-48"></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 bg-muted rounded animate-pulse w-20"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-8 bg-muted rounded animate-pulse w-16"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  {filters.search || filters.status !== "all"
                    ? "No appointments found matching your filters."
                    : "No appointments found."}
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow
                  key={appointment.id}
                  className={deleting === appointment.id ? "opacity-50" : ""}
                >
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {truncateText(appointment.name, 25)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {truncateText(appointment.email, 30)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">
                        {truncateText(appointment.service.title, 20)}
                      </div>
                      <div className="text-sm text-green-600 font-semibold">
                        {formatPrice(
                          appointment.service.price,
                          appointment.service.currency
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${
                        statusColors[appointment.status] ||
                        "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(appointment.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => handleViewClick(appointment)}
                        disabled={deleting === appointment.id}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => handleEditClick(appointment)}
                        disabled={deleting === appointment.id}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                            disabled={deleting === appointment.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the appointment for{" "}
                              <strong>{appointment.name}</strong>? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(appointment.id)}
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Complete information about this appointment
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Name
                      </Label>
                      <p className="text-sm font-medium">
                        {selectedAppointment.name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Email
                      </Label>
                      <p className="text-sm flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedAppointment.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Phone
                      </Label>
                      <p className="text-sm flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedAppointment.phone}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Status
                      </Label>
                      <div>
                        <Badge
                          variant="outline"
                          className={`capitalize ${
                            statusColors[selectedAppointment.status] ||
                            "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          {selectedAppointment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Service Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Service
                      </Label>
                      <p className="text-sm font-medium">
                        {selectedAppointment.service.title}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Price
                      </Label>
                      <p className="text-sm font-semibold text-green-600">
                        {formatPrice(
                          selectedAppointment.service.price,
                          selectedAppointment.service.currency
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Birth Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Birth Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Date of Birth
                      </Label>
                      <p className="text-sm font-medium">
                        {formatDateOfBirth(selectedAppointment.dateOfBirth)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Time of Birth
                      </Label>
                      <p className="text-sm flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedAppointment.timeOfBirth}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Place of Birth
                      </Label>
                      <p className="text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedAppointment.placeOfBirth}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              {selectedAppointment.additionalNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Additional Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedAppointment.additionalNotes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Appointment Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Appointment Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created At
                      </Label>
                      <p className="text-sm">
                        {formatDate(selectedAppointment.createdAt)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Last Updated
                      </Label>
                      <p className="text-sm">
                        {formatDate(selectedAppointment.updatedAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Appointment</DialogTitle>
            <DialogDescription>
              Update the status and notes for this appointment
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) =>
                    setEditForm((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Add any additional notes..."
                  value={editForm.additionalNotes}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      additionalNotes: e.target.value,
                    }))
                  }
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {editForm.additionalNotes.length}/500 characters
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedAppointment(null);
                    setEditForm({ status: "", additionalNotes: "" });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStatusUpdate}
                  disabled={updating === selectedAppointment?.id}
                >
                  {updating === selectedAppointment?.id ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsPage;
