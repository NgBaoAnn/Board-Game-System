import { BookmarkCheck, Gamepad2, Wrench, Pencil } from "lucide-react";
import { ConfigProvider, Input, Select, theme, InputNumber, Modal, Button, Form, message } from "antd";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

export default function AdminGamesPage() {
    const { isDarkTheme } = useTheme();

    const [games, setGames] = useState([
        { id: "GM-101", name: "Caro hàng 5", rows: 5, cols: 5, enabled: true },
        { id: "GM-102", name: "Caro hàng 4", rows: 4, cols: 4, enabled: true },
        { id: "GM-103", name: "Tic-Tac-Toe", rows: 3, cols: 3, enabled: true },
        { id: "GM-104", name: "Rắn săn mồi", rows: 5, cols: 4, enabled: true },
        { id: "GM-105", name: "Ghép hàng 3 (Candy Rush)", rows: 8, cols: 8, enabled: true },
        { id: "GM-106", name: "Cờ trí nhớ", rows: 4, cols: 4, enabled: false },
        { id: "GM-107", name: "Bảng vẽ tự do", rows: 6, cols: 6, enabled: true },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [form] = Form.useForm();

    const openModal = (game) => {
        setSelectedGame(game);
        form.setFieldsValue({ rows: game.rows, cols: game.cols });
        setModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields()
            .then((values) => {
                setGames(games.map((g) => (g.id === selectedGame.id ? { ...g, rows: values.rows, cols: values.cols } : g)));
                setModalVisible(false);
                form.resetFields();
            })
            .catch(() => {
                message.error("Please correct the errors in the form and try again.");
            });
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    return (
        <div className="flex-1 p-6 pt-20 xl:pt-6 overflow-y-auto bg-gray-50/50 dark:bg-background-dark">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Game Catalog</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl">Manage your game library, configure rulesets, and control game availability status for players.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-surface-dark p-5 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-primary/30 transition-colors">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Games</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{games.filter((g) => g.enabled).length}</p>
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
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{games.filter((g) => !g.enabled).length}</p>
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
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 w-30 text-center truncate">Board Config</th>
                                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 w-30 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {games.map((game) => (
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
                                            <span className="text-xs text-gray-500">ID: {game.id}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center w-30">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                                                {game.rows} × {game.cols}
                                            </div>
                                            <button
                                                className="text-gray-400 hover:text-primary cursor-pointer transition-colors hover:scale-110 active:scale-95 duration-200"
                                                title="Edit Board Configuration"
                                                onClick={() => openModal(game)}
                                            >
                                                <Pencil className="size-5" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 w-30 text-center">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                className="sr-only peer"
                                                type="checkbox"
                                                checked={game.enabled}
                                                onChange={(e) => setGames(games.map((g) => (g.id === game.id ? { ...g, enabled: e.target.checked } : g)))}
                                            />
                                            <div
                                                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['']
                                             after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                                            ></div>
                                            <span className="ml-3 text-xs font-medium text-gray-900 dark:text-gray-300">{game.enabled ? "Enabled" : "Disabled"}</span>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal title={`Edit Board Configuration for ${selectedGame?.name}`} open={modalVisible} onOk={handleModalOk} onCancel={handleModalCancel} okText="Save" cancelText="Cancel">
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Number of Rows [3-20]"
                        name="rows"
                        rules={[
                            { required: true, message: "Please input the number of rows!" },
                            { type: "number", min: 3, max: 20, message: "Rows must be between 3 and 20" },
                        ]}
                    >
                        <InputNumber min={3} max={20} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Number of Columns [3-20]"
                        name="cols"
                        rules={[
                            { required: true, message: "Please input the number of columns!" },
                            { type: "number", min: 3, max: 20, message: "Columns must be between 3 and 20" },
                        ]}
                    >
                        <InputNumber min={3} max={20} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
