"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push("/auth/login");
      } else if (user?.role !== "organization") {
        // Redirect to appropriate dashboard based on role
        if (user?.role === "admin") {
          router.push("/admin/dashboard");
        } else if (user?.role === "user") {
          router.push("/dashboard");
        }
      }
    };

    init();
  }, [checkAuth, router, user]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (!user || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`bg-green-800 text-white w-64 fixed h-full transition-all duration-300 ${
          isSidebarOpen ? "left-0" : "-left-64"
        }`}
      >
        <div className="p-4 border-b border-green-700">
          <h2 className="text-xl font-semibold">Ushuari</h2>
          <p className="text-green-300 text-sm">Organization Dashboard</p>
        </div>

        <nav className="mt-6">
          <ul>
            <li>
              <Link
                href="/organization/dashboard"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-700"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/organization/cases"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-700"
              >
                Cases
              </Link>
            </li>
            <li>
              <Link
                href="/organization/profile"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-700"
              >
                Organization Profile
              </Link>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-green-700"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } flex-1`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-center">
            <span className="text-gray-800 mr-2">{user.name}</span>
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
