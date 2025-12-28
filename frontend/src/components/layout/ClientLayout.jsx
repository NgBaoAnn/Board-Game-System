import { Outlet } from 'react-router-dom'

export default function ClientLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1">
        <Outlet />
      </main>
      
    </div>
  )
}
