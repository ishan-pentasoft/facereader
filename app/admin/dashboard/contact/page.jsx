"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function AdminContactPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [sortAsc, setSortAsc] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/contact/getAllContacts", {
          method: "GET",
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load contacts");
        setContacts(data.contacts || []);
      } catch (e) {
        setError(e?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? contacts.filter((c) => {
          return (
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.toLowerCase().includes(q) ||
            c.subject.toLowerCase().includes(q)
          );
        })
      : contacts;
    const sorted = [...base].sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortAsc ? da - db : db - da;
    });
    return sorted;
  }, [contacts, query, sortAsc]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  useEffect(() => {
    setPage(1);
  }, [query, pageSize]);

  async function handleDelete(contactId) {
    setDeletingId(contactId);
    setError(null);

    try {
      const res = await fetch(`/api/contact/contactById/${contactId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      // Remove the contact from the local state
      setContacts(contacts.filter((contact) => contact.id !== contactId));
    } catch (e) {
      setError(e.message || "Failed to delete contact");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex-1 space-y-8 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-semibold">Contacts</h1>

        <div className="flex w-full sm:w-auto items-center gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full sm:max-w-[15rem] md:max-w-[20rem]"
          />
          <Button
            variant="outline"
            onClick={() => setSortAsc((s) => !s)}
            title={sortAsc ? "Sort: Oldest first" : "Sort: Newest first"}
            className="cursor-pointer"
          >
            {sortAsc ? "Oldest" : "Newest"}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-background">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="size-5 animate-spin mr-2" /> Loading contacts...
          </div>
        ) : error ? (
          <div className="text-destructive py-10 text-center">{error}</div>
        ) : rows.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            No contacts found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Name</TableHead>
                <TableHead className="min-w-[150px] hidden sm:table-cell">
                  Email
                </TableHead>
                <TableHead className="min-w-[120px] hidden md:table-cell">
                  Phone
                </TableHead>
                <TableHead className="min-w-[180px]">Subject</TableHead>
                <TableHead className="min-w-[160px] hidden lg:table-cell">
                  Created
                </TableHead>
                <TableHead className="w-0 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {c.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {c.phone}
                  </TableCell>
                  <TableCell
                    className="max-w-[150px] truncate"
                    title={c.subject}
                  >
                    {c.subject}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {new Date(c.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="cursor-pointer"
                          >
                            <Eye className="size-4 mr-2" /> View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{c.subject}</DialogTitle>
                            <DialogDescription className="text-[12px]">
                              Submitted by {c.name} • {c.email} <br /> {c.phone}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-2 whitespace-pre-wrap text-sm">
                            {c.message}
                          </div>
                          <div className="mt-4 text-xs text-muted-foreground">
                            Created: {new Date(c.createdAt).toLocaleString()}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === c.id}
                            className="cursor-pointer"
                          >
                            {deletingId === c.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Contact Message
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the message from "
                              {c.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(c.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {!loading && !error && filtered.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {start + 1}-{Math.min(start + pageSize, filtered.length)} of{" "}
            {filtered.length}
          </div>
          <div className="flex items-center justify-between gap-2">
            <select
              className="border bg-background px-2 py-1 rounded-md text-sm cursor-pointer"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="cursor-pointer"
              >
                Prev
              </Button>
              <span className="text-sm">
                Page {currentPage} / {pageCount}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className="cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
