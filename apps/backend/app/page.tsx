import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to the Backend
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A powerful and secure backend service for your applications
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Authentication */}
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">
                Authentication
              </h3>
              <p className="mt-2 text-gray-500">
                Secure user authentication and authorization system
              </p>
              <Link
                href="/login"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800"
              >
                Login →
              </Link>
            </div>

            {/* API Routes */}
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">API Routes</h3>
              <p className="mt-2 text-gray-500">
                RESTful API endpoints for your application needs
              </p>
              <Link
                href="/api"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800"
              >
                Explore API →
              </Link>
            </div>

            {/* Admin Dashboard */}
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-900">
                Admin Dashboard
              </h3>
              <p className="mt-2 text-gray-500">
                Manage your application with the admin dashboard
              </p>
              <Link
                href="/admin/blog"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800"
              >
                Go to Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Backend Service. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
