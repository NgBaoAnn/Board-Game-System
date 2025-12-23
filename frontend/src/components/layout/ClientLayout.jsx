import { Outlet } from 'react-router-dom'

export default function ClientLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Board Game System</h1>
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
