// Direct imports for better bundle size (rule: bundle-barrel-imports)
import Users from 'lucide-react/dist/esm/icons/users'
import Radio from 'lucide-react/dist/esm/icons/radio'
import Star from 'lucide-react/dist/esm/icons/star'
import Ban from 'lucide-react/dist/esm/icons/ban'
import Search from 'lucide-react/dist/esm/icons/search'
import LockKeyholeOpen from 'lucide-react/dist/esm/icons/lock-keyhole-open'
import EllipsisVertical from 'lucide-react/dist/esm/icons/ellipsis-vertical'
import LockKeyhole from 'lucide-react/dist/esm/icons/lock-keyhole'
import { useState, useEffect, useRef, useCallback } from "react";
import { Select, Input, Pagination, Spin, message, ConfigProvider, theme, Modal } from "antd";
import { useTheme } from "@/context/ThemeContext";
import { userApi } from "@/api/user";
import "@/styles/index.css";

export default function AdminUsersPage() {
    const [role, setRole] = useState("all");
    const [active, setActive] = useState("all");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [counts, setCounts] = useState({ totalUsers: 0, totalPlayers: 0, totalUsersCreatedToday: 0, totalBanned: 0 });
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    const { isDarkMode } = useTheme();

    const searchDebounceRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        const loadUsers = async () => {
            setLoading(true);
            try {
                const [usersRes, countsRes] = await Promise.all([userApi.getAllUsers(page, pageSize, search, role, active), userApi.getUserCounts()]);

                if (!usersRes || usersRes.success === false) {
                    throw new Error(usersRes.message || usersRes.error || "Cannot load users list");
                }

                const payload = usersRes.data || {};
                const items = payload.data || [];
                const pagination = payload.pagination || {};

                setUsers(items);
                setTotal(pagination.total || 0);

                if (countsRes && countsRes.success !== false && countsRes.data) {
                    setCounts(countsRes.data);
                } else {
                    setCounts({ totalUsers: 0, totalPlayers: 0, totalUsersCreatedToday: 0, totalBanned: 0 });
                }
            } catch (err) {
                console.error(err);
                message.error(err.message || "Failed to load users data");
                setUsers([]);
                setTotal(0);
                setCounts({ totalUsers: 0, totalPlayers: 0, totalUsersCreatedToday: 0, totalBanned: 0 });
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
        return () => controller.abort();
    }, [page, role, active, search]);

    useEffect(() => {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            setPage(1);
            setSearch(searchInput.trim());
        }, 400);
        return () => clearTimeout(searchDebounceRef.current);
    }, [searchInput]);

    const statusBadgeClass = (active) => {
        if (active) return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
    };

    const rowClassName = (user) => {
        const base = "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group";
        if (!user.active) return `${base} bg-red-50/50 dark:bg-red-900/5`;
        return base;
    };

    // Memoized timeAgo function (rule: js-cache-function-results)
    const timeAgo = useCallback((iso) => {
        if (!iso) return "—";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        const diff = Math.floor((Date.now() - d.getTime()) / 1000);
        if (diff < 60) return `${diff} sec ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    }, []);

    const getInitials = (username) => {
        if (!username) return "??";
        return username.substring(0, 2).toUpperCase();
    };

    const toggleLock = async (user) => {
        try {
            const newActiveStatus = !user.active;
            await userApi.updateUser(user.id, { active: newActiveStatus });
            message.success(`User ${newActiveStatus ? "activated" : "banned"} successfully`);

            setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, active: newActiveStatus } : u)));

            const countsRes = await userApi.getUserCounts();
            if (countsRes && countsRes.success !== false && countsRes.data) {
                setCounts(countsRes.data);
            }
        } catch (err) {
            console.error(err);
            message.error(err.message || "Failed to update user status");
        }
    };

    const handleOpenRoleModal = (user) => {
        setSelectedUser(user);
        setSelectedRole(user.role.id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setSelectedRole(null);
    };

    const handleUpdateRole = async () => {
        if (!selectedUser || !selectedRole) return;

        try {
            await userApi.updateUser(selectedUser.id, { role_id: selectedRole });
            message.success("User role updated successfully");

            const usersRes = await userApi.getAllUsers(page, pageSize, search, role, active);
            if (usersRes && usersRes.success !== false && usersRes.data) {
                const payload = usersRes.data || {};
                const items = payload.data || [];
                const pagination = payload.pagination || {};
                setUsers(items);
                setTotal(pagination.total || 0);
            }

            handleCloseModal();
        } catch (err) {
            console.error(err);
            message.error(err.message || "Failed to update user role");
        }
    };

    return (
        <div className="flex-1 p-6 pt-20 xl:pt-6 overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage player accounts, roles, and permissions.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm hover:shadow-md border border-border-light dark:border-border-dark flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Users</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.totalUsers?.toLocaleString() ?? "—"}</div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <Users />
                    </div>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm hover:shadow-md border border-border-light dark:border-border-dark flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Player Active</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.totalPlayers ?? "—"}</div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform">
                        <Radio />
                    </div>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm hover:shadow-md border border-border-light dark:border-border-dark flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created Today</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.totalUsersCreatedToday ?? "—"}</div>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-500 dark:text-yellow-400 group-hover:scale-110 transition-transform">
                        <Star />
                    </div>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm hover:shadow-md border border-border-light dark:border-border-dark flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Banned</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.totalBanned ?? "—"}</div>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform">
                        <Ban />
                    </div>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-md border border-border-light dark:border-border-dark mb-6">
                <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <ConfigProvider
                        theme={{
                            token: {
                                colorBgContainer: isDarkMode ? "#212f4d" : "#fbfbfb",
                                colorText: isDarkMode ? "#fff" : "#000",
                            },
                            algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                        }}
                    >
                        <div className="relative w-full md:w-96">
                            <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} prefix={<Search className="p-1" />} placeholder="Search by name, email, or ID..." />
                        </div>
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
                            <Select
                                value={role}
                                onChange={(v) => {
                                    setRole(v);
                                    setPage(1);
                                }}
                                options={[
                                    { value: "all", label: "All Roles" },
                                    { value: "admin", label: "Admin" },
                                    { value: "user", label: "Player" },
                                ]}
                                style={{ minWidth: "120px" }}
                            />
                            <Select
                                value={active}
                                onChange={(v) => {
                                    setActive(v);
                                    setPage(1);
                                }}
                                options={[
                                    { value: "all", label: "All Status" },
                                    { value: "true", label: "Active" },
                                    { value: "false", label: "Banned" },
                                ]}
                                style={{ minWidth: "120px" }}
                            />
                        </div>
                    </ConfigProvider>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-border-light dark:border-border-dark">
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">User</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Role</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Last Update</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <Spin />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className={rowClassName(u)}>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="relative">
                                                    {u.avatar_url ? (
                                                        <img
                                                            alt={`${u.username} avatar`}
                                                            className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                                                            src={u.avatar_url}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-pink-700 border-2 border-white dark:border-gray-700 shadow-sm flex items-center justify-center text-white font-semibold text-sm">
                                                            {getInitials(u.username)}
                                                        </div>
                                                    )}
                                                    {u.active && <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></div>}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{u.username}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                                {u.role.name === "admin" ? "Administrator" : u.role.name === "premium" ? "Premium" : "Player"}
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(u.active)}`}>
                                                {u.active ? "Active" : "Banned"}
                                            </span>
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{timeAgo(u.updated_at)}</div>
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-4">
                                                <div
                                                    className={`text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors hover:scale-110 active:scale-95 duration-200 ${
                                                        !u.active ? "text-red-400" : ""
                                                    }`}
                                                    title="Lock Account"
                                                    onClick={() => toggleLock(u)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {!u.active ? <LockKeyhole /> : <LockKeyholeOpen />}
                                                </div>
                                                <div
                                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors hover:scale-110 active:scale-95 duration-200"
                                                    title="More"
                                                    onClick={() => handleOpenRoleModal(u)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <EllipsisVertical />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-border-light dark:border-border-dark flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {(page - 1) * pageSize + 1} to{" "}
                        {Math.min(page * pageSize, total)} of{" "}
                        {total.toLocaleString()} results
                    </p>

                    <ConfigProvider
                        theme={{
                            token: {
                                colorBgContainer: isDarkMode ? "#212f4d" : "#f8f8f8",
                                colorText: isDarkMode ? "#fff" : "#000",
                            },
                            algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                        }}
                    >
                        <Pagination current={page} pageSize={pageSize} total={total} showSizeChanger={false} onChange={(p) => setPage(p)} />
                    </ConfigProvider>
                </div>
            </div>

            <ConfigProvider
                theme={{
                    token: {
                        colorBgContainer: isDarkMode ? "#212f4d" : "#ffffff",
                        colorText: isDarkMode ? "#fff" : "#000",
                    },
                    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }}
            >
                <Modal
                    title="Update User Role"
                    open={isModalOpen}
                    onOk={handleUpdateRole}
                    onCancel={handleCloseModal}
                    okText="Update"
                    cancelText="Cancel"
                >
                    {selectedUser && (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">User:</p>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    {selectedUser.avatar_url ? (
                                        <img
                                            src={selectedUser.avatar_url}
                                            alt={selectedUser.username}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
                                            {getInitials(selectedUser.username)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{selectedUser.username}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Select Role:</p>
                                <Select
                                    value={selectedRole}
                                    onChange={setSelectedRole}
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: 1, label: "Admin" },
                                        { value: 2, label: "User (Player)" },
                                    ]}
                                />
                            </div>
                        </div>
                    )}
                </Modal>
            </ConfigProvider>
        </div>
    );
}
