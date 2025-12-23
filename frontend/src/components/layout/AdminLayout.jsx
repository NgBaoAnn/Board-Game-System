import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-slate-900 text-white p-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Board Game System</p>
      </footer>
    </div>
  )
}
