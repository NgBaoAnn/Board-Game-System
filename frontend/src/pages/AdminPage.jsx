import { Card, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Users, Gamepad2, Settings } from 'lucide-react'

const adminLinks = [
    {
        title: 'Dashboard',
        description: 'View statistics and analytics',
        icon: LayoutDashboard,
        path: '/admin/dashboard',
        color: 'bg-blue-500',
    },
    {
        title: 'Users',
        description: 'Manage user accounts',
        icon: Users,
        path: '/admin/users',
        color: 'bg-green-500',
    },
    {
        title: 'Games',
        description: 'Manage games and content',
        icon: Gamepad2,
        path: '/admin/games',
        color: 'bg-purple-500',
    },
    {
        title: 'Settings',
        description: 'System configuration',
        icon: Settings,
        path: '/admin/settings',
        color: 'bg-orange-500',
    },
]

export default function AdminPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Panel</h1>
            <p className="text-gray-500 mb-8">Welcome to the administration area</p>

            <Row gutter={[24, 24]}>
                {adminLinks.map((item) => {
                    const IconComponent = item.icon
                    return (
                        <Col key={item.title} xs={24} sm={12} lg={6}>
                            <Link to={item.path}>
                                <Card
                                    hoverable
                                    className="h-full rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                                            <IconComponent size={28} className="text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {item.description}
                                        </p>
                                    </div>
                                </Card>
                            </Link>
                        </Col>
                    )
                })}
            </Row>
        </div>
    )
}
