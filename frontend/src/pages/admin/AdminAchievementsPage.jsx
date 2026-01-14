import { Search, Plus, Edit, Trash } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Modal, Form, Input, Select, InputNumber, message, ConfigProvider, theme, Pagination, Spin } from "antd";
import { useTheme } from "@/context/ThemeContext";
import { gameApi } from "@/api/game";
import achievementApi from "@/api/api-achievement";

export default function AchievementsPage() {
    const [achievements, setAchievements] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState(null);
    const [form] = Form.useForm();
    const { isDarkMode } = useTheme();

    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState("all");
    const [selectedConditionType, setSelectedConditionType] = useState("all");
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [pagination, setPagination] = useState({ page: 1, limit: 6, total: 0 });

    // Constants for debounce
    const DEBOUNCE_DELAY = 500;

    // Fetch games for filter and modal
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await gameApi.getGames();
                if (response && response.success !== false) {
                    setGames(response.games || []);
                }
            } catch (error) {
                console.error("Failed to fetch games:", error);
                message.error("Failed to load games");
            }
        };
        fetchGames();
    }, []);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(prev => {
                if (prev !== searchInput) {
                    setPagination(p => ({ ...p, page: 1 })); // Reset page when search term changes
                    return searchInput;
                }
                return prev;
            });
        }, DEBOUNCE_DELAY);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Fetch achievements
    const fetchAchievements = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearch,
                game_id: selectedGame !== "all" ? selectedGame : undefined,
                condition_type: selectedConditionType !== "all" ? selectedConditionType : undefined,
            };

            const response = await achievementApi.getAllAchievements(params);
            if (response && response.success) {
                const data = response.data;
                setAchievements(data.data || []);
                setPagination((prev) => ({
                    ...prev,
                    total: data.total,
                }));
            }
        } catch (error) {
            console.error("Failed to fetch achievements:", error);
            message.error("Failed to load achievements");
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, debouncedSearch, selectedGame, selectedConditionType]);

    // Initial fetch and fetch on dependency change (no debounce)
    useEffect(() => {
        fetchAchievements();
    }, [fetchAchievements]);

    // Handle Page Change
    const handlePageChange = (page, pageSize) => {
        setPagination((prev) => ({ ...prev, page, limit: pageSize }));
    };

    const handleOpenModal = (achievement = null) => {
        setEditingAchievement(achievement);
        if (achievement) {
            form.setFieldsValue({
                ...achievement,
                // Ensure number types are correctly set if coming from simplified API response
                condition_value: parseInt(achievement.condition_value),
                game_id: parseInt(achievement.game_id)
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                condition_type: "score",
                game_id: games.length > 0 ? games[0].id : undefined
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAchievement(null);
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            
            if (editingAchievement) {
                // Edit existing achievement
                await achievementApi.updateAchievement(editingAchievement.id, values);
                message.success("Achievement updated successfully!");
            } else {
                // Create new achievement
                await achievementApi.createAchievement(values);
                message.success("Achievement created successfully!");
            }

            handleCloseModal();
            fetchAchievements(); // Reload list
        } catch (error) {
            console.error("Operation failed:", error);
            const errorMsg = error.response?.data?.message || "Operation failed!";
            message.error(errorMsg);
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: "Delete Achievement",
            content: "Are you sure you want to delete this achievement?",
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    await achievementApi.deleteAchievement(id);
                    message.success("Achievement deleted successfully!");
                    fetchAchievements();
                    // Check if page needs to decrement if last item deleted
                    if (achievements.length === 1 && pagination.page > 1) {
                         setPagination(prev => ({...prev, page: prev.page - 1}));
                    }
                } catch (error) {
                    const errorMsg = error.response?.data?.message || "Delete failed!";
                    message.error(errorMsg);
                }
            },
        });
    };

    const getConditionText = (type, value) => {
        const typeMap = {
            score: `Score >= ${value}`,
            play_count: `Play Count >= ${value}`,
            time: `Time >= ${value}s`,
            win_count: `Win Count >= ${value}`,
        };
        return typeMap[type] || `${type} >= ${value}`;
    };

    const getIconColor = (index) => {
        const colors = [
            { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400" },
            { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" },
            { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
            { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
        ];
        return colors[index % colors.length];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    return (
        <div className="flex-1 pt-20 xl:pt-6 p-6 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">Achievement Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Create, edit, and manage achievements for all games.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white hover:bg-primary-hover rounded-lg text-sm font-medium transition-colors shadow-sm shadow-primary/20"
                    >
                        <Plus className="text-xl" />
                        <span>Add Achievement</span>
                    </button>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark mb-6">
                <div className="p-4 w-full md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                            <Input 
                                onChange={(e) => setSearchInput(e.target.value)} 
                                prefix={<Search className="p-1" />} 
                                placeholder="Search by name" 
                                value={searchInput}
                            />
                        </div>
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
                            <Select
                                value={selectedGame}
                                onChange={(v) => {
                                    setSelectedGame(v);
                                    setPagination(prev => ({...prev, page: 1})); // Reset to page 1 on filter change
                                }}
                                options={[{ value: "all", label: "All Games" }, ...games.map((game) => ({ value: game.id, label: game.name }))]}
                                style={{ minWidth: "150px" }}
                            />
                            <Select
                                value={selectedConditionType}
                                onChange={(v) => {
                                    setSelectedConditionType(v);
                                    setPagination(prev => ({...prev, page: 1})); // Reset to page 1 on filter change
                                }}
                                options={[
                                    { value: "all", label: "All Types" },
                                    { value: "score", label: "Score" },
                                    //{ value: "play_count", label: "Play Count" },
                                    //{ value: "time", label: "Time" },
                                    //{ value: "win_count", label: "Win Count" },
                                ]}
                                style={{ minWidth: "120px" }}
                            />
                        </div>
                    </ConfigProvider>
                </div>
                
                <div className="p-6 bg-gray-50/50 dark:bg-gray-900/30 min-h-100">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {achievements.map((achievement, index) => {
                                const iconColor = getIconColor(index);
                                return (
                                    <div
                                        key={achievement.id}
                                        className="flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group"
                                    >
                                        <div className="p-5 flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`w-12 h-12 rounded-lg ${iconColor.bg} flex items-center justify-center text-2xl`}>
                                                    {achievement.icon || "🏆"}
                                                </div>
                                                <div className="flex items-center gap-2">

                                                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 uppercase">
                                                        {achievement.condition_type}
                                                    </span>
                                                    <span className="w-2 h-2 rounded-full bg-green-500" title="Active"></span>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{achievement.name}</h3>
                                            <p className="text-xs text-gray-400 font-mono mb-2">CODE: {achievement.code}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{achievement.description}</p>
                                            <div className="space-y-2 mb-2">
                                                <div className="flex justify-between text-xs border-b border-gray-100 dark:border-gray-700 pb-2">
                                                    <span className="text-gray-500">Game</span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">{achievement.game_name || achievement.game_code || achievement.game_id}</span>
                                                </div>
                                                <div className="flex justify-between text-xs pb-1">
                                                    <span className="text-gray-500">Condition</span>
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">{getConditionText(achievement.condition_type, achievement.condition_value)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-between items-center">
                                            <span className="text-xs text-gray-400">Created: {formatDate(achievement.created_at)}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(achievement)}
                                                    className="p-1.5 text-gray-500 hover:text-primary hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="size-5.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(achievement.id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash className="size-5.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                 {/* Pagination - Ant Design Pagination */}
                 {pagination.total > 0 && (
                    <div className="p-4 border-t border-border-light dark:border-border-dark flex justify-end">
                        <ConfigProvider
                             theme={{
                                token: {
                                    colorPrimary: "#1d7af2",
                                    colorBgContainer: isDarkMode ? "#212f4d" : "#fff",
                                    colorText: isDarkMode ? "#fff" : "#000",
                                },
                                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                            }}
                        >
                            <Pagination
                                current={pagination.page}
                                pageSize={pagination.limit}
                                total={pagination.total}
                                onChange={handlePageChange}
                            />
                        </ConfigProvider>
                    </div>
                 )}
            </div>

            <ConfigProvider
                theme={{
                    token: {
                        colorBgContainer: isDarkMode ? "#20252e" : "#fbfbfb",
                        colorText: isDarkMode ? "#fff" : "#000",
                    },
                    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }}
            >
                <Modal
                    title={editingAchievement ? "Edit Achievement" : "Create Achievement"}
                    open={isModalOpen}
                    onOk={handleSubmit}
                    onCancel={handleCloseModal}
                    okText={editingAchievement ? "Update" : "Create"}
                    cancelText="Cancel"
                    width={600}
                    style={{ top: 40 }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            condition_type: "score",
                            game_id: games.length > 0 ? games[0].id : undefined
                        }}
                    >
                        <Form.Item name="code" label="Code" rules={[{ required: true, message: "Please input achievement code!" }]}>
                            <Input placeholder="e.g., FIRST_VICTORY" />
                        </Form.Item>

                        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please input achievement name!" }]}>
                            <Input placeholder="e.g., First Victory" />
                        </Form.Item>

                        <Form.Item name="description" label="Description">
                            <Input.TextArea rows={3} placeholder="Describe what this achievement is about..." />
                        </Form.Item>

                        <Form.Item name="icon" label="Icon" rules={[{ required: true, message: "Please select an icon!" }]}>
                            <Select
                                placeholder="Select an icon"
                                options={[
                                    { value: "🏆", label: "🏆 Trophy" },
                                    { value: "🥇", label: "🥇 Gold Medal" },
                                    { value: "🥈", label: "🥈 Silver Medal" },
                                    { value: "🥉", label: "🥉 Bronze Medal" },
                                    { value: "👑", label: "👑 Crown" },
                                    { value: "⭐", label: "⭐ Star" },
                                    { value: "💎", label: "💎 Gem" },
                                    { value: "🔥", label: "🔥 Fire" },
                                    { value: "🎯", label: "🎯 Target" },
                                    { value: "⚔️", label: "⚔️ Swords" },
                                    { value: "🛡️", label: "🛡️ Shield" },
                                    { value: "🧩", label: "🧩 Puzzle" },
                                ]}
                            />
                        </Form.Item>

                        <div className="flex gap-3">
                            <Form.Item name="game_id" label="Game" rules={[{ required: true, message: "Please select game!" }]} className="flex-1">
                                <Select placeholder="Select a game" options={games.map((game) => ({ value: game.id, label: game.name }))} />
                            </Form.Item>

                            <Form.Item name="condition_type" label="Condition Type" rules={[{ required: true, message: "Please select condition type!" }]} className="flex-1">
                                <Select
                                    options={[
                                        { value: "score", label: "Score" },
                                        { value: "play_count", label: "Play Count" },
                                        { value: "time", label: "Time (seconds)" },
                                        { value: "win_count", label: "Win Count" },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item name="condition_value" label="Condition Value" rules={[{ required: true, message: "Please input condition value!" }]} className="flex-1">
                                <InputNumber style={{ width: "100%" }} min={1} placeholder="e.g., 1000" />
                            </Form.Item>
                        </div>
                    </Form>
                </Modal>
            </ConfigProvider>
        </div>
    );
}
