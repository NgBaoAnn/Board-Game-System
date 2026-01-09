import { Award, Zap, Search, Trophy, Plus, PlusSquare, TrendingUp, CheckCircle, Edit, Trash, Clock, Target, Medal } from "lucide-react";
import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber, message, ConfigProvider, theme } from "antd";
import { useTheme } from "@/context/ThemeContext";
import { gameApi } from "@/api/game";

// Mock data based on database schema
const initialAchievements = [
    {
        id: "11111111-1111-1111-1111-111111111111",
        code: "FIRST_VICTORY",
        name: "First Victory",
        description: "Win your first game in any category. This is the onboarding achievement.",
        game_id: 1,
        condition_type: "win_count",
        condition_value: 1,
        created_at: "2023-10-12T10:00:00Z",
    },
    {
        id: "22222222-2222-2222-2222-222222222222",
        code: "MASTER_STRATEGIST",
        name: "Master Strategist",
        description: "Win a game without losing more than 2 units. Requires advanced gameplay validation.",
        game_id: 1,
        condition_type: "win_count",
        condition_value: 5,
        created_at: "2023-11-05T10:00:00Z",
    },
    {
        id: "33333333-3333-3333-3333-333333333333",
        code: "SCORE_1000",
        name: "Score Master",
        description: "Reach a total score of 1000 points.",
        game_id: 1,
        condition_type: "score",
        condition_value: 1000,
        created_at: "2023-12-01T10:00:00Z",
    },
    {
        id: "44444444-4444-4444-4444-444444444444",
        code: "GRAND_VETERAN",
        name: "Grand Veteran",
        description: "Play 1000 total matches across all game types. The ultimate grinder achievement.",
        game_id: 1,
        condition_type: "play_count",
        condition_value: 1000,
        created_at: "2023-12-15T10:00:00Z",
    },
];

export default function AchievementsPage() {
    const [achievements, setAchievements] = useState(initialAchievements);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState(null);
    const [form] = Form.useForm();
    const { isDarkMode } = useTheme();

    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState("all");
    const [selectedConditionType, setSelectedConditionType] = useState("all");
    const [loading, setLoading] = useState(false);

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

    const handleOpenModal = (achievement = null) => {
        setEditingAchievement(achievement);
        if (achievement) {
            form.setFieldsValue(achievement);
        } else {
            form.resetFields();
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
                setAchievements((prev) => prev.map((ach) => (ach.id === editingAchievement.id ? { ...ach, ...values } : ach)));
                message.success("Achievement updated successfully!");
            } else {
                // Create new achievement
                const newAchievement = {
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    ...values,
                    created_at: new Date().toISOString(),
                };
                setAchievements((prev) => [newAchievement, ...prev]);
                message.success("Achievement created successfully!");
            }

            handleCloseModal();
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: "Delete Achievement",
            content: "Are you sure you want to delete this achievement?",
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: () => {
                setAchievements((prev) => prev.filter((ach) => ach.id !== id));
                message.success("Achievement deleted successfully!");
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

    const getIconByType = (conditionType) => {
        const iconMap = {
            score: TrendingUp,
            play_count: Target,
            time: Clock,
            win_count: Trophy,
        };
        return iconMap[conditionType] || Medal;
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col justify-between h-24 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Achievements</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{achievements.length}</p>
                    </div>
                    <div className="absolute right-3 top-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-500 dark:text-purple-400">
                        <PlusSquare />
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col justify-between h-24 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">112</p>
                    </div>
                    <div className="absolute right-3 top-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-500 dark:text-green-400">
                        <CheckCircle />
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col justify-between h-24 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total XP Value</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">185k</p>
                    </div>
                    <div className="absolute right-3 top-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500 dark:text-blue-400">
                        <Zap />
                    </div>
                </div>
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark flex flex-col justify-between h-24 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User Unlocks</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">14.2k</p>
                    </div>
                    <div className="absolute right-3 top-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-500 dark:text-yellow-400">
                        <Award />
                    </div>
                </div>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark mb-6">
                <div className="p-4 w-full md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                            <Input onChange={(e) => setSearchInput(e.target.value)} prefix={<Search className="p-1" />} placeholder="Search by name, email, or ID..." />
                        </div>
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
                            <Select
                                value={selectedGame}
                                onChange={(v) => {
                                    setSelectedGame(v);
                                }}
                                options={[{ value: "all", label: "All Games" }, ...games.map((game) => ({ value: game.id, label: game.name }))]}
                                style={{ minWidth: "200px" }}
                            />
                            <Select
                                value={selectedConditionType}
                                onChange={(v) => {
                                    setSelectedConditionType(v);
                                }}
                                options={[
                                    { value: "all", label: "All Types" },
                                    { value: "score", label: "Score" },
                                    { value: "play_count", label: "Play Count" },
                                    { value: "time", label: "Time" },
                                    { value: "win_count", label: "Win Count" },
                                ]}
                                style={{ minWidth: "120px" }}
                            />
                        </div>
                    </ConfigProvider>
                </div>
                <div className="p-6 bg-gray-50/50 dark:bg-gray-900/30 min-h-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {achievements.map((achievement, index) => {
                            const iconColor = getIconColor(index);
                            const IconComponent = getIconByType(achievement.condition_type);
                            return (
                                <div
                                    key={achievement.id}
                                    className="flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow group"
                                >
                                    <div className="p-5 flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-lg ${iconColor.bg} flex items-center justify-center ${iconColor.text}`}>
                                                <IconComponent className="text-2xl" />
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
                                                <span className="text-gray-500">Game ID</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{achievement.game_id}</span>
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
                </div>
            </div>

            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#ec4899",
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
                            game_id: 1,
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
