import { Users, Radio, Star, Ban, Search, LockKeyholeOpen, EllipsisVertical, LockKeyhole } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Select, Input, Pagination, Spin, message, ConfigProvider, theme } from "antd";
import { useTheme } from "@/context/ThemeContext";
import "@/styles/index.css";

const SAMPLE_USERS = [
    {
        id: 1,
        name: "Alex Morgan",
        email: "alex.m@example.com",
        avatar: "https://i.pravatar.cc/150?img=32",
        role: "admin",
        status: "active",
        lastActive: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        name: "Sarah Connor",
        email: "sarah.c@skynet.net",
        avatar: "https://i.pravatar.cc/150?img=12",
        role: "player",
        status: "inactive",
        lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        name: "Michael Jordan",
        email: "mj23@bulls.com",
        avatar: "https://i.pravatar.cc/150?img=5",
        role: "premium",
        status: "active",
        lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
        id: 4,
        name: "Bad Actor",
        email: "hacker@anon.com",
        avatar: "https://i.pravatar.cc/150?img=40",
        role: "player",
        status: "banned",
        lastActive: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 5,
        name: "Emily Lin",
        email: "emily.l@design.io",
        avatar: "https://i.pravatar.cc/150?img=16",
        role: "player",
        status: "banned",
        lastActive: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
        id: 6,
        name: "Carlos Vega",
        email: "c.vega@cards.io",
        avatar: "https://i.pravatar.cc/150?img=18",
        role: "premium",
        status: "active",
        lastActive: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
        id: 7,
        name: "Linh Tran",
        email: "linh.tran@vnmail.com",
        avatar: "https://i.pravatar.cc/150?img=25",
        role: "player",
        status: "active",
        lastActive: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    },
    {
        id: 8,
        name: "Jana Novak",
        email: "jana.n@europe.io",
        avatar: "https://i.pravatar.cc/150?img=45",
        role: "player",
        status: "inactive",
        lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

const computeCountsFrom = (arr) => ({
    totalUsers: arr.length,
    activeNow: arr.filter((u) => u.status === "active").length,
    premium: arr.filter((u) => u.role === "premium").length,
    banned: arr.filter((u) => u.status === "banned").length,
});

export default function AdminUsersPage() {
    const [role, setRole] = useState("all");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [users, setUsers] = useState(SAMPLE_USERS);
    const [total, setTotal] = useState(SAMPLE_USERS.length);
    const [counts, setCounts] = useState(computeCountsFrom(SAMPLE_USERS));
    const [loading, setLoading] = useState(false);

    const { isDarkTheme } = useTheme();

    const searchDebounceRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                params.set("page", page);
                params.set("pageSize", pageSize);
                if (role && role !== "all") params.set("role", role);
                if (status && status !== "all") params.set("status", status);
                if (search) params.set("search", search);

                // Adjust endpoint as needed: expects { data: [], total: number, counts: { totalUsers,... } }
                const res = await fetch(`/api/admin/users?${params.toString()}`, { signal: controller.signal });
                if (!res.ok) throw new Error("Không thể tải danh sách người dùng");
                const json = await res.json();
                setUsers(json.data || []);
                setTotal(json.total ?? 0);
                setCounts(json.counts || { totalUsers: 0, activeNow: 0, premium: 0, banned: 0 });
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    // Fallback to sample data for local/demo purposes
                    setUsers(SAMPLE_USERS);
                    setTotal(SAMPLE_USERS.length);
                    setCounts(computeCountsFrom(SAMPLE_USERS));
                    message.warn(err.message || "Không thể tải dữ liệu người dùng. Hiển thị data mẫu.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
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
        try {
            const res = await fetch(`/api/admin/users/${user.id}/lock`, { method: "POST" });
            if (!res.ok) throw new Error("Không thể thay đổi trạng thái tài khoản");
            message.success("Đã cập nhật trạng thái tài khoản");
            // refresh list
            setPage(1);
            setSearch((s) => s);
        } catch (err) {
            console.error(err);
            message.error(err.message || "Lỗi khi thay đổi trạng thái");
            // If backend fails, apply the change locally to sample/mock data so UI remains interactive
            setUsers((prev) => {
                const next = prev.map((u) => (u.id === user.id ? { ...u, status: u.status === "banned" ? "active" : "banned" } : u));
                setCounts(computeCountsFrom(next));
                return next;
            });
            message.warn("Thay đổi được áp dụng cục bộ (mock) do lỗi kết nối");
        }
    };

    return (
        <div className="flex-1 p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage player accounts, roles, and permissions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Users</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.totalUsers?.toLocaleString() ?? "—"}</div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <Users />
                    </div>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Now</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.activeNow ?? "—"}</div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform">
                        <Radio />
                    </div>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Premium</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.premium ?? "—"}</div>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-500 dark:text-yellow-400 group-hover:scale-110 transition-transform">
                        <Star />
                    </div>
                </div>

                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Banned</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{counts.banned ?? "—"}</div>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform">
                        <Ban />
                    </div>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark mb-6">
                <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: "#ec4899",
                                colorBgContainer: isDarkTheme() ? "#212f4d" : "#fbfbfb",
                                colorText: isDarkTheme() ? "#fff" : "#000",
                            },
                            algorithm: isDarkTheme() ? theme.darkAlgorithm : theme.defaultAlgorithm,
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

                <div>
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
                                                        alt={`${u.name} avatar`}
                                                        className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                                                        src={u.avatar || "https://via.placeholder.com/40"}
                                                    />
                                                    {/* online indicator if active */}
                                                    {u.status === "active" && (
                                                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                                {u.role === "admin" ? "Administrator" : u.role === "premium" ? "Premium" : "Player"}
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(u.status)}`}>
                                                {u.status === "active" ? "Active" : u.status === "banned" ? "Banned" : "Offline"}
                                            </span>
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{timeAgo(u.lastActive)}</div>
                                        </td>

                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-4">
                                                <div
                                                    className={`text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ${u.status === "banned" ? "text-red-400" : ""}`}
                                                    title="Lock Account"
                                                    onClick={() => toggleLock(u)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {u.status === "banned" ? <LockKeyhole /> : <LockKeyholeOpen />}
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

                    <div>
                        <Pagination current={page} pageSize={pageSize} total={total} showSizeChanger={false} onChange={(p) => setPage(p)} />
                    </div>
                </div>
            </div>
        </div>
    );
}
