"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  // =====================================
  // Auth Pages
  // No Sidebar + No Header
  // =====================================
  const isAuthPage =
    pathname === "/Admin/login" ||
    pathname === "/Admin/signup";

  // Login / Signup ke liye
  // sirf page render hoga
  if (isAuthPage) {
    return <>{children}</>;
  }

  // =====================================
  // Admin Panel
  // Sidebar + Header
  // =====================================
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Area */}
      <div
        className={`
          min-h-screen
          transition-all
          duration-300
          ease-in-out
          ${
            isSidebarCollapsed
              ? "lg:pl-16"
              : "lg:pl-64"
          }
        `}
      >
        {/* Header */}
        <AdminHeader
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}