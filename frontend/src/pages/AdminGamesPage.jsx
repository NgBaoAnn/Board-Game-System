import { BookmarkCheck, Gamepad2, Wrench, Pencil } from "lucide-react";
import { ConfigProvider, Input, theme, InputNumber, Modal, Form, message, Spin } from "antd";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { gameApi } from "@/api/game";

const { TextArea } = Input;

export default function AdminGamesPage() {
    const { isDarkMode } = useTheme();

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            setLoading(true);
            const response = await gameApi.getGames();
            setGames(response.games || []);
        } catch (error) {
            message.error("Failed to fetch games");
            console.error("Error fetching games:", error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (game) => {
        setSelectedGame(game);
        form.setFieldsValue({
            name: game.name,
            description: game.description,
            board_row: game.board_row,
            board_col: game.board_col,
        });
        setModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields()
            .then(async (values) => {
                try {
                    await gameApi.updateGame(selectedGame.id, {
                        name: values.name,
                        description: values.description,
                        board_row: values.board_row,
                        board_col: values.board_col,
                    });
                    message.success("Game updated successfully");
                    await fetchGames();
                    setModalVisible(false);
                    form.resetFields();
                } catch (error) {
                    message.error("Failed to update game");
                    console.error("Error updating game:", error);
                }
            })
            .catch(() => {
                message.error("Please correct the errors in the form and try again.");
            });
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    const handleToggleActive = async (game) => {
        try {
            await gameApi.updateGame(game.id, {
                is_active: !game.is_active,
            });
            message.success(`Game ${!game.is_active ? "enabled" : "disabled"} successfully`);
            await fetchGames();
        } catch (error) {
            message.error("Failed to update game status");
            console.error("Error updating game status:", error);
        }
    };

    return (
        <div className="flex-1 p-6 pt-20 xl:pt-6 overflow-y-auto bg-gray-50/50 dark:bg-background-dark">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Game Catalog</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl">Manage your game library, control game availability status for players.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Games</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{games.filter((g) => g.is_active).length}</p>
                        <p className="text-xs text-gray-400 mt-1">Currently available to players</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-icons-outlined text-2xl">
                            <Gamepad2 />
                        </span>
                    </div>
                </div>
                <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Maintenance</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{games.filter((g) => !g.is_active).length}</p>
                        <p className="text-xs text-orange-500 mt-1">Requires attention</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-icons-outlined text-2xl">
                            <Wrench />
                        </span>
                    </div>
                </div>
                <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sessions</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">1,208</p>
                        <p className="text-xs text-gray-400 mt-1">Across all games today</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-icons-outlined text-2xl">
                            <BookmarkCheck />
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 w-16 text-center">
                                    <span className="sr-only">Icon</span>
                                </th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Game Details</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Description</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 w-30 text-center truncate">Board Config</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 w-30 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        <Spin />
                                    </td>
                                </tr>
                            ) : games.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No games found
                                    </td>
                                </tr>
                            ) : (
                                games.map((game) => (
                                    <tr key={game.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-sm bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                {game.avatar ? (
                                                    <img alt={game.name} className="h-full w-full object-cover" src={game.avatar} />
                                                ) : (
                                                    <span>
                                                        {game.name
                                                            .split(" ")
                                                            .slice(0, 2)
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900 dark:text-white">{game.name}</span>
                                                <span className="text-xs text-gray-500">Code: {game.code}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate" title={game.description}>
                                                {game.description || "No description"}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center w-30">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                                                    {game.board_row} × {game.board_col}
                                                </div>
                                                <button
                                                    className="text-gray-400 hover:text-primary cursor-pointer transition-colors hover:scale-110 active:scale-95 duration-200"
                                                    title="Edit Game"
                                                    onClick={() => openModal(game)}
                                                >
                                                    <Pencil className="size-5" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 w-30 text-center">
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input className="sr-only peer" type="checkbox" checked={game.is_active} onChange={() => handleToggleActive(game)} />
                                                <div
                                                    className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['']
                                             after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                                                ></div>
                                                <span className="ml-3 text-xs font-medium text-gray-900 dark:text-gray-300">{game.is_active ? "Enabled" : "Disabled"}</span>
                                            </label>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <ConfigProvider
                theme={{
                    token: {
                        colorBgContainer: isDarkMode ? "#212329" : "#f8fafc",
                        colorBorder: isDarkMode ? "#2d3748" : "#e2e8f0",
                    },
                    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }}
            >
                <Modal title={`Edit Game: ${selectedGame?.name}`} open={modalVisible} onOk={handleModalOk} onCancel={handleModalCancel} okText="Save" cancelText="Cancel" width={600}>
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Game Name"
                            name="name"
                            rules={[
                                { required: true, message: "Please input the game name!" },
                                { min: 3, message: "Name must be at least 3 characters" },
                            ]}
                        >
                            <Input placeholder="Enter game name" />
                        </Form.Item>
                        <Form.Item label="Description" name="description" rules={[{ max: 500, message: "Description must not exceed 500 characters" }]}>
                            <TextArea rows={4} placeholder="Enter game description" maxLength={500} showCount />
                        </Form.Item>
                        <div className="flex flex-row w-full justify-around">
                            <Form.Item
                                label="Number of Rows [3-20]"
                                name="board_row"
                                rules={[
                                    { required: true, message: "Please input the number of rows!" },
                                    { type: "number", min: 3, max: 20, message: "Rows must be between 3 and 20" },
                                ]}
                            >
                                <InputNumber min={3} max={20} style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item
                                label="Number of Columns [3-20]"
                                name="board_col"
                                rules={[
                                    { required: true, message: "Please input the number of columns!" },
                                    { type: "number", min: 3, max: 20, message: "Columns must be between 3 and 20" },
                                ]}
                            >
                                <InputNumber min={3} max={20} style={{ width: "100%" }} />
                            </Form.Item>
                        </div>
                    </Form>
                </Modal>
            </ConfigProvider>
        </div>
    );
}
