"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/generated/prisma";
import { ArrowUpDown } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  whatsapp: string | null;
  role: UserRole;
  akadKreditCount?: number;
  pemberkasanCount?: number;
}

export default function UsersClientPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users");
      }

      setUsers(data.users);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: UserRole) => {
    try {
      setUpdatingUserId(userId);

      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user role");
      }

      // Update the user in the local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: data.user.role } : user
        )
      );

      toast.success("User role updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Handle role change
  const handleRoleChange = async (userId: string, role: UserRole) => {
    await updateUserRole(userId, role);
  };

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        (user.name && user.name.toLowerCase().includes(term)) ||
        (user.email && user.email.toLowerCase().includes(term)) ||
        (user.whatsapp && user.whatsapp.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        // Handle null/undefined values
        const aValue = a[sortConfig.key as keyof User] ?? 0;
        const bValue = b[sortConfig.key as keyof User] ?? 0;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [users, searchTerm, sortConfig]);

  if (loading) {
    return (
      <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
        <div className="space-y-8">
          <h1 className="text-4xl font-extrabold clay-text-title">
            Users
          </h1>
        </div>
        <div className="clay-panel p-8">
          <p className="clay-text-muted font-bold text-xl">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 container mx-auto w-full space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold clay-text-title">
          Users
        </h1>
        <p className="clay-text-muted font-bold text-lg">Admin Only - Manage all users</p>
      </div>

      {/* Search Input */}
      <div className="clay-panel p-4 sm:p-6">
        <div className="mb-6">
          <Input
            placeholder="Cari user berdasarkan nama, email, atau WhatsApp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="clay-panel border-none text-[#1f4f59] focus:ring-2 focus:ring-white/50 h-12"
          />
        </div>

        {filteredAndSortedUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="clay-text-muted font-bold">
              {searchTerm ? "Tidak ada user yang cocok dengan pencarian" : "Tidak ada user ditemukan"}
            </p>
          </div>
        ) : (
          <div className="rounded-[20px] overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-white/40 hover:bg-white/40">
                  <TableHead 
                    className="clay-text-title text-sm sm:text-lg font-extrabold cursor-pointer hover:text-[#d64560]"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="clay-text-title text-sm sm:text-lg font-extrabold cursor-pointer hover:text-[#d64560]"
                    onClick={() => requestSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold">WhatsApp</TableHead>
                  <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold">Role</TableHead>
                  <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold text-center">Akad Kredit</TableHead>
                  <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold text-center">Pemberkasan</TableHead>
                  <TableHead className="clay-text-title text-sm sm:text-lg font-extrabold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedUsers.map((user) => (
                  <TableRow key={user.id} className="border-white/40 hover:bg-white/20">
                    <TableCell className="clay-text-title font-bold py-4 max-w-[150px] truncate">{user.name || "-"}</TableCell>
                    <TableCell className="clay-text-muted font-bold py-4 max-w-[200px] truncate">{user.email || "-"}</TableCell>
                    <TableCell className="clay-text-muted font-bold py-4 max-w-[150px] truncate">{user.whatsapp || "-"}</TableCell>
                    <TableCell className="clay-text-muted font-bold py-4">
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                        disabled={updatingUserId === user.id}
                      >
                        <SelectTrigger className="bg-white/40 border-white text-[#1f4f59] font-bold focus:ring-[#d64560] rounded-[20px] backdrop-blur-md transition-colors w-[120px] h-10">
                          {updatingUserId === user.id ? (
                            <span className="clay-text-muted font-bold">Updating...</span>
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent className="bg-[#aae4ee] border-white/40 rounded-[20px]">
                          <SelectItem value={UserRole.PENDING} className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Pending</SelectItem>
                          <SelectItem value={UserRole.USER} className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">User</SelectItem>
                          <SelectItem value={UserRole.ADMIN} className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="clay-text-muted font-bold text-center py-4">
                      {user.akadKreditCount || 0}
                    </TableCell>
                    <TableCell className="clay-text-muted font-bold text-center py-4">
                      {user.pemberkasanCount || 0}
                    </TableCell>
                    <TableCell className="py-4">
                      {updatingUserId === user.id ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          className="clay-text-muted font-bold"
                        >
                          Updating...
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
