import { Button } from 'antd'
import { Link } from 'react-router-dom'


export default function HomePage() {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">Welcome to Board Game System</h2>
      <p className="text-lg mb-6">Select a game or login to get started</p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => alert('Feature coming soon')}>Play Game</Button>
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </div>
    </div>
  )
}