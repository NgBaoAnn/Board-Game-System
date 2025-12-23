import { Link } from 'react-router-dom'

export default function AdminPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      <p className="text-lg mb-4">Manage games, users, and statistics here.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Back to Home
      </Link>
    </div>
  )
}
