"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/generated/prisma";

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

  if (loading) {
    return (
      <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Users
          </h1>
        </div>
        <div className="bg-gray-800/50 border border-purple-900/50 rounded-xl p-8 shadow-lg">
          <p className="text-purple-200 text-xl">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Users
        </h1>
        <p className="text-purple-200 text-lg">Admin Only - Manage all users</p>
      </div>

      <div className="bg-gray-800/50 border border-purple-900/50 rounded-xl overflow-hidden shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-purple-900/50 hover:bg-gray-800">
              <TableHead className="text-purple-200 text-lg font-semibold">
                Nama
              </TableHead>
              <TableHead className="text-purple-200 text-lg font-semibold">
                Email
              </TableHead>
              <TableHead className="text-purple-200 text-lg font-semibold">
                WhatsApp
              </TableHead>
              <TableHead className="text-purple-200 text-lg font-semibold">
                Role
              </TableHead>
              <TableHead className="text-purple-200 text-lg font-semibold text-center">
                Total Akad
              </TableHead>
              <TableHead className="text-purple-200 text-lg font-semibold text-center">
                Pemberkasan
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="border-purple-900/30 hover:bg-gray-800/50"
              >
                <TableCell className="font-medium text-white py-4">
                  {user.name || "-"}
                </TableCell>
                <TableCell className="text-gray-300 py-4">
                  {user.email || "-"}
                </TableCell>
                <TableCell className="text-gray-300 py-4">
                  {user.whatsapp || "-"}
                </TableCell>
                <TableCell className="py-4">
                  <Select
                    value={user.role}
                    onValueChange={(value) =>
                      updateUserRole(user.id, value as UserRole)
                    }
                    disabled={updatingUserId === user.id}
                  >
                    <SelectTrigger className="w-[120px] bg-gray-900 border-purple-900/50 text-purple-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-purple-900/50">
                      <SelectItem
                        value={UserRole.USER}
                        className="text-purple-100 focus:bg-purple-900 focus:text-white"
                      >
                        USER
                      </SelectItem>
                      <SelectItem
                        value={UserRole.ADMIN}
                        className="text-purple-100 focus:bg-purple-900 focus:text-white"
                      >
                        ADMIN
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-gray-300 text-center py-4">
                  {user.akadKreditCount || 0}
                </TableCell>
                <TableCell className="text-gray-300 text-center py-4">
                  {user.pemberkasanCount || 0}
                </TableCell>
                <TableCell className="py-4">
                  {updatingUserId === user.id ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled
                      className="text-purple-300"
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
    </div>
  );
}
