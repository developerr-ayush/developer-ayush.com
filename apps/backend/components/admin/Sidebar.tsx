"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut } from "../../auth";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed z-40 bottom-4 right-4 bg-indigo-800 text-white p-2 rounded-full shadow-lg"
        aria-label="Toggle Sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen bg-gradient-to-b from-indigo-800 to-purple-900 text-white shadow-xl transition-all duration-300 ease-in-out lg:sticky lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:w-72`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-white"
              aria-label="Close Sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="space-y-1">
            <Link
              href="/admin/blog"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-white/10 transition group"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="w-5 h-5 mr-3 text-indigo-300 group-hover:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <span>Blog Posts</span>
            </Link>
            <Link
              href="/admin/category"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-white/10 transition group"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="w-5 h-5 mr-3 text-indigo-300 group-hover:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span>Categories</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-white/10 transition group"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="w-5 h-5 mr-3 text-indigo-300 group-hover:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span>Users</span>
            </Link>
            {/* logout */}
            <button
              // onClick={() => signOut()}
              className="flex items-center px-4 py-3 rounded-lg hover:bg-white/10 transition group"
            >
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
