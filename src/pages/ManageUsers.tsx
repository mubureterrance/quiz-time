import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import Card from "../components/ui/Card";
import { useBadges } from "../hooks/useBadges";
import ReactSelect from "react-select";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  RefreshCw,
  Trash2,
  UserCheck,
  Shield,
  ArrowLeft,
} from "lucide-react";

const ROLE_OPTIONS = ["user", "admin"];

type UserData = {
  uid: string;
  email: string;
  displayName: string;
  role: "user" | "admin";
  badges: string[];
  createdAt?: any;
  lastLogin?: any;
};

export default function ManageUsers() {
  const { userProfile } = useAuth();
  const { badges, loading: badgesLoading, error: badgesError } = useBadges();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "email" | "role" | "created">(
    "name"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const snapshot = await getDocs(collection(db, "users"));
      const data: UserData[] = snapshot.docs.map((docSnap) => ({
        uid: docSnap.id,
        ...(docSnap.data() as Omit<UserData, "uid">),
      }));
      setUsers(data);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBadgeChange = async (
    uid: string,
    badgesOrBadge: string[] | string,
    checked?: boolean
  ) => {
    const user = users.find((u) => u.uid === uid);
    if (!user) return;
    setUpdatingUsers((prev) => new Set(prev).add(uid));
    try {
      let updatedBadges: string[];
      if (Array.isArray(badgesOrBadge)) {
        updatedBadges = badgesOrBadge;
      } else {
        updatedBadges = checked
          ? [...new Set([...(user.badges || []), badgesOrBadge])]
          : (user.badges || []).filter((b) => b !== badgesOrBadge);
      }
      await updateDoc(doc(db, "users", uid), { badges: updatedBadges });
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, badges: updatedBadges } : u))
      );
    } catch (err) {
      setError("Failed to update badges. Please try again.");
      console.error("Error updating badges:", err);
    } finally {
      setUpdatingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(uid);
        return newSet;
      });
    }
  };

  const handleRoleChange = async (uid: string, newRole: "user" | "admin") => {
    if (uid === userProfile?.uid) {
      setError("You cannot change your own role.");
      return;
    }

    setUpdatingUsers((prev) => new Set(prev).add(uid));

    try {
      await updateDoc(doc(db, "users", uid), { role: newRole });

      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      setError("Failed to update user role. Please try again.");
      console.error("Error updating role:", err);
    } finally {
      setUpdatingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(uid);
        return newSet;
      });
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (uid === userProfile?.uid) {
      setError("You cannot delete your own account.");
      return;
    }

    setUpdatingUsers((prev) => new Set(prev).add(uid));

    try {
      await deleteDoc(doc(db, "users", uid));
      setUsers((prev) => prev.filter((u) => u.uid !== uid));
      setShowDeleteConfirm(null);
    } catch (err) {
      setError("Failed to delete user. Please try again.");
      console.error("Error deleting user:", err);
    } finally {
      setUpdatingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(uid);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredAndSortedUsers = users
    .filter((user) => {
      const matchesSearch =
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.displayName?.toLowerCase() || "";
          bValue = b.displayName?.toLowerCase() || "";
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "role":
          aValue = a.role;
          bValue = b.role;
          break;
        case "created":
          aValue = a.createdAt?.toDate?.() || new Date(0);
          bValue = b.createdAt?.toDate?.() || new Date(0);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: typeof sortBy }) => {
    if (sortBy !== field)
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  if (loading || badgesLoading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (badgesError) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">{badgesError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  to="/admin"
                  className="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Manage Users
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Manage user roles and permissions
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={fetchUsers}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700 ml-4"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {users.length}
              </p>
            </div>
            <p className="text-xs text-gray-500">Total Users</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                <UserCheck className="w-3.5 h-3.5 text-green-600" />
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {users.filter((u) => u.role === 'user').length}
              </p>
            </div>
            <p className="text-xs text-gray-500">Regular Users</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {users.filter((u) => u.role === 'admin').length}
              </p>
            </div>
            <p className="text-xs text-gray-500">Administrators</p>
          </div>
        </div>


        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="min-w-[120px]"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 transition duration-200"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </span>
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 transition duration-200"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </span>
                      <SortIcon field="email" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100 transition duration-200"
                    onClick={() => handleSort("role")}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </span>
                      <SortIcon field="role" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Badges
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
                          {user.displayName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.displayName || "No name"}
                          </div>
                          {user.uid === userProfile?.uid && (
                            <div className="text-xs text-blue-600 font-medium">
                              (You)
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user.uid,
                            e.target.value as "user" | "admin"
                          )
                        }
                        disabled={
                          updatingUsers.has(user.uid) ||
                          user.uid === userProfile?.uid
                        }
                        className="text-sm disabled:bg-gray-100"
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="min-w-[220px]">
                        <ReactSelect
                          isMulti
                          value={badges
                            .filter(
                              (badge) =>
                                Array.isArray(user.badges) &&
                                user.badges.includes(badge.id)
                            )
                            .map((badge) => ({
                              value: badge.id,
                              label: badge.name,
                              color: badge.color,
                            }))}
                          options={badges.map((badge) => ({
                            value: badge.id,
                            label: badge.name,
                            color: badge.color,
                          }))}
                          onChange={(selectedOptions) => {
                            const selectedBadgeIds = Array.isArray(
                              selectedOptions
                            )
                              ? selectedOptions.map((opt) => opt.value)
                              : [];
                            handleBadgeChange(user.uid, selectedBadgeIds, true);
                          }}
                          isDisabled={updatingUsers.has(user.uid)}
                          className="text-sm"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: "#d1d5db",
                              "&:hover": {
                                borderColor: "#9ca3af",
                              },
                            }),
                            multiValue: (base, state) => ({
                              ...base,
                              backgroundColor: state.data.color || "#6b7280",
                              color: "#fff",
                            }),
                            multiValueLabel: (base) => ({
                              ...base,
                              color: "#fff",
                            }),
                            multiValueRemove: (base) => ({
                              ...base,
                              color: "#fff",
                              ":hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                color: "#fff",
                              },
                            }),
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.uid !== userProfile?.uid && (
                        <button
                          onClick={() => setShowDeleteConfirm(user.uid)}
                          disabled={updatingUsers.has(user.uid)}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 p-2 rounded-lg hover:bg-red-50 transition duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No users found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm Delete
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowDeleteConfirm(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (showDeleteConfirm) handleDeleteUser(showDeleteConfirm);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
