import { Link } from 'react-router-dom'
import Button from '@/components/common/Button'

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <Button onClick={(e) => e.preventDefault()}>Sign In</Button>
      </form>
      <p className="text-center mt-4">
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </p>
    </div>
  )
}
