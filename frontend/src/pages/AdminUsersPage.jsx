import { Users, Radio, Star, Ban, Search, LockKeyholeOpen, EllipsisVertical, LockKeyhole } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Select, Input, Pagination, Spin, message, ConfigProvider, theme } from "antd";
import { useTheme } from "@/context/ThemeContext";
import { fetchUsers } from "@/services/userService";
import "@/styles/index.css";



export default function AdminUsersPage() {
    const [role, setRole] = useState("all");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [counts, setCounts] = useState({ totalUsers: 0, activeNow: 0, premium: 0, banned: 0 });
    const [loading, setLoading] = useState(false);

    const { isDarkMode } = useTheme();

    const searchDebounceRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        const loadUsers = async () => {
            setLoading(true);
            try {
                const filters = {};
                //if (role && role !== "all") filters.role = role;
                //if (status && status !== "all") filters.status = status;
                //if (search) filters.search = search;

                const res = await fetchUsers(page, pageSize, filters);
                if (!res || res.success === false) throw new Error(res.message || res.error || "Không thể tải danh sách người dùng");

                const payload = res.data || {};
                const items = payload.data || [];
                const pagination = payload.pagination || {};
                setUsers(items);
                setTotal(pagination.total);
                setCounts({totalUsers: pagination.total, activeNow: 3, premium: 0, banned: 0});  
            } catch (err) {
                console.error(err);
                message.error(err.message || "Không thể tải dữ liệu người dùng. Hiển thị data mẫu.");
                setUsers([]);
                setTotal(0);
                setCounts({totalUsers: 0, activeNow: 0, premium: 0, banned: 0});
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
        return () => controller.abort();
    }, [page, role, status, search]);

    // Debounce the search input so we don't ping backend on every keystroke
    useEffect(() => {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = setTimeout(() => {
            setPage(1);
            setSearch(searchInput.trim());
        }, 400);
        return () => clearTimeout(searchDebounceRef.current);
    }, [searchInput]);

    const statusBadgeClass = (s) => {
        if (!s) return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
        if (s === "active") return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
        if (s === "banned") return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    };

    const rowClassName = (user) => {
        const base = "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group";
        if (user.status === "banned") return `${base} bg-red-50/50 dark:bg-red-900/5`;
        return base;
    };

    const timeAgo = (iso) => {
        if (!iso) return "—";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        const diff = Math.floor((Date.now() - d.getTime()) / 1000);
        if (diff < 60) return `${diff} sec ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    };

    const toggleLock = async (user) => {
        // try {
        //     const res = await fetch(`/api/admin/users/${user.id}/lock`, { method: "POST" });
        //     if (!res.ok) throw new Error("Không thể thay đổi trạng thái tài khoản");
        //     message.success("Đã cập nhật trạng thái tài khoản");
        //     // refresh list
        //     setPage(1);
        //     setSearch((s) => s);
        // } catch (err) {
        //     console.error(err);
        //     message.error(err.message || "Lỗi khi thay đổi trạng thái");
        //     // If backend fails, apply the change locally to sample/mock data so UI remains interactive
        //     setUsers((prev) => {
        //         const next = prev.map((u) => (u.id === user.id ? { ...u, status: u.status === "banned" ? "active" : "banned" } : u));
        //         setCounts(computeCountsFrom(next));
        //         return next;
        //     });
        //     message.warn("Thay đổi được áp dụng cục bộ (mock) do lỗi kết nối");
        // }
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
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Now</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.activeNow ?? "—"}</div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform">
                        <Radio />
                    </div>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm hover:shadow-md border border-border-light dark:border-border-dark flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Premium</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.premium ?? "—"}</div>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-500 dark:text-yellow-400 group-hover:scale-110 transition-transform">
                        <Star />
                    </div>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm hover:shadow-md border border-border-light dark:border-border-dark flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Banned</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.banned ?? "—"}</div>
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
                                colorPrimary: "#ec4899",
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
                                    { value: "player", label: "Player" },
                                    { value: "premium", label: "Premium" },
                                ]}
                                style={{ minWidth: "120px" }}
                            />
                            <Select
                                value={status}
                                onChange={(v) => {
                                    setStatus(v);
                                    setPage(1);
                                }}
                                options={[
                                    { value: "all", label: "All Status" },
                                    { value: "active", label: "Active" },
                                    { value: "inactive", label: "Offline" },
                                    { value: "banned", label: "Banned" },
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
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Last Active</th>
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
                                                    <img
                                                        alt={`${u.username} avatar`}
                                                        className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                                                        src={u.avatar_url}
                                                    />
                                                    {/* online indicator if active */}
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
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(u.active ? "active" : u.status === "banned" ? "banned" : "inactive")}`}>
                                                {u.active ? "Active" : u.active === "banned" ? "Banned" : "Offline"}
                                            </span>
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{timeAgo(u.updated_at)}</div>
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-4">
                                                <div
                                                    className={`text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors hover:scale-110 active:scale-95 duration-200 ${
                                                        !u.active  ? "text-red-400" : ""
                                                    }`}
                                                    title="Lock Account"
                                                    onClick={() => toggleLock(u)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {!u.active ? <LockKeyhole /> : <LockKeyholeOpen />}
                                                </div>
                                                <div className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" title="More">
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
                        Showing <span className="font-medium text-gray-900 dark:text-white">{(page - 1) * pageSize + 1}</span> to{" "}
                        <span className="font-medium text-gray-900 dark:text-white">{Math.min(page * pageSize, total)}</span> of
                        <span className="font-medium text-gray-900 dark:text-white ml-1">{total.toLocaleString()}</span> results
                    </p>

                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: "#ec4899",
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
        </div>
    );
}
