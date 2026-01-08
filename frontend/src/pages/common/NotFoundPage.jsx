import { Link } from 'react-router-dom'
import Lottie from 'lottie-react'
import robotAnimation from '@/assets/animations/404-robot.json'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Robot Animation */}
      <div className="w-64 h-64 md:w-80 md:h-80 mb-4">
        <Lottie
          animationData={robotAnimation}
          loop={true}
          className="w-full h-full"
        />
      </div>

      {/* Error Message */}
      <div className="text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
          Oops! Trang không tìm thấy
        </h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
        </p>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Quay về Trang chủ
        </Link>
      </div>
    </div>
  )
}
