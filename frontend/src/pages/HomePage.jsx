import { Button, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context'


export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const goPlay = () => {
    navigate('/boardgame')
  }

  const handleLogout = async () => {
    try {
      await logout()
      message.success('Logged out')
    } catch (e) {
      message.error(e.message || 'Logout failed')
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">Welcome to Board Game System</h2>
      <p className="text-lg mb-6">Select a game or login to get started</p>
      <div className="flex gap-4 justify-center">
        <Button onClick={goPlay}>Play Game</Button>
        {isAuthenticated ? (
          <Button danger onClick={handleLogout}>Logout</Button>
        ) : (
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  )
}