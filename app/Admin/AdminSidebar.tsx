"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Train,
  LayoutDashboard,
  Building2,
  Layers,
  MapPin,
  Navigation,
  FileText,
  AlertTriangle,
  Users,
  Bot,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const menuItems = [
  {
    name: "Dashboard",
    href: "/Admin",
    icon: LayoutDashboard,
  },
  {
    name: "Stations",
    href: "/Admin/stations",
    icon: Building2,
  },
  {
    name: "Platforms",
    href: "/Admin/platforms",
    icon: Layers,
  },
  {
    name: "Facilities",
    href: "/Admin/facilities",
    icon: MapPin,
  },
  {
    name: "Navigation",
    href: "/Admin/navigation",
    icon: Navigation,
  },
  {
    name: "RAG Documents",
    href: "/Admin/documents",
    icon: FileText,
  },
  {
    name: "Document Verification",
    href: "/Admin/document-verification",
    icon: ShieldCheck,
  },
  {
    name: "Complaints",
    href: "/Admin/complaints",
    icon: AlertTriangle,
  },
  {
    name: "Users",
    href: "/Admin/users",
    icon: Users,
  },
  {
    name: "AI Agents",
    href: "/Admin/ai-agents",
    icon: Bot,
  },
  {
    name: "Settings",
    href: "/Admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();


  const handleLogout = () => {
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("adminUser");

  sessionStorage.clear();

  setIsOpen(false);

  router.push("/Admin/login");
};

  return (
    <>
      {/* =====================================
          Mobile Overlay
      ====================================== */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* =====================================
          Sidebar
      ====================================== */}
      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen flex-col
          bg-slate-950 text-slate-300 shadow-xl
          transition-all duration-300 ease-in-out

          ${isCollapsed ? "w-16" : "w-64"}

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* =====================================
            Sidebar Header / Logo
        ====================================== */}
        <div
          className={`
            flex h-16 shrink-0 items-center
            border-b border-slate-800

            ${
              isCollapsed
                ? "justify-center px-2"
                : "justify-between px-4"
            }
          `}
        >
          {/* ================================
              Expanded Logo
          ================================= */}
          {!isCollapsed && (
            <Link
              href="/Admin"
              onClick={() => setIsOpen(false)}
              className="flex min-w-0 items-center gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10">
                <Train className="h-6 w-6 text-blue-500" />
              </div>

              <div className="min-w-0 whitespace-nowrap">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  Railway-AI
                </h1>

                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Admin Panel
                </p>
              </div>
            </Link>
          )}

          {/* ================================
              Collapsed Hamburger
          ================================= */}
          {isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-lg
                text-slate-300
                transition-colors
                hover:bg-slate-800
                hover:text-white
              "
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}

          {/* ================================
              Expanded Hamburger
          ================================= */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="
                hidden h-9 w-9
                items-center justify-center
                rounded-lg
                text-slate-400
                transition-colors
                hover:bg-slate-800
                hover:text-white
                lg:flex
              "
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* ================================
              Mobile Close
          ================================= */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="
              rounded-lg p-2
              text-slate-400
              transition-colors
              hover:bg-slate-800
              hover:text-white
              lg:hidden
            "
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =====================================
            Navigation
        ====================================== */}
        <nav className="flex-1 overflow-y-auto px-2 py-5">
          {/* Section Title */}
          {!isCollapsed && (
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Administration
            </p>
          )}

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                (item.href !== "/Admin" &&
                  pathname.startsWith(item.href));

              return (
                <div
                  key={item.name}
                  className="group relative"
                >
                  {/* Navigation Link */}
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center rounded-lg
                      text-sm font-medium
                      transition-all duration-200

                      ${
                        isCollapsed
                          ? "h-11 justify-center px-0"
                          : "gap-3 px-3 py-2.5"
                      }

                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >
                    <Icon
                      className={`
                        h-5 w-5 shrink-0

                        ${
                          isActive
                            ? "text-white"
                            : "text-slate-500 group-hover:text-slate-300"
                        }
                      `}
                    />

                    {!isCollapsed && (
                      <span className="truncate">
                        {item.name}
                      </span>
                    )}
                  </Link>

                  {/* =================================
                      Tooltip - Collapsed Mode
                  ================================= */}
                  {isCollapsed && (
                    <div
                      className="
                        pointer-events-none
                        absolute left-full top-1/2
                        z-[100]
                        ml-3
                        -translate-y-1/2
                        whitespace-nowrap
                        rounded-md
                        bg-slate-900
                        px-3 py-2
                        text-xs font-medium
                        text-white
                        opacity-0
                        shadow-lg
                        transition-opacity duration-200
                        group-hover:opacity-100
                      "
                    >
                      {item.name}

                      {/* Tooltip Arrow */}
                      <div
                        className="
                          absolute right-full top-1/2
                          -translate-y-1/2
                          border-y-[5px]
                          border-r-[5px]
                          border-y-transparent
                          border-r-slate-900
                        "
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* =====================================
            Logout
        ====================================== */}
        <div className="shrink-0 border-t border-slate-800 p-2">
          <div className="group relative">
            <button
  type="button"
  onClick={handleLogout}
  className={`
    flex w-full items-center rounded-lg
    text-sm font-medium
    text-slate-400
    transition-colors
    hover:bg-slate-800
    hover:text-rose-400
    ${
      isCollapsed
        ? "h-11 justify-center px-0"
        : "gap-3 px-3 py-2.5"
    }
  `}
>
              <LogOut className="h-5 w-5 shrink-0" />

              {!isCollapsed && (
                <span>Logout</span>
              )}
            </button>

            {/* Logout Tooltip */}
            {isCollapsed && (
              <div
                className="
                  pointer-events-none
                  absolute left-full top-1/2
                  z-[100]
                  ml-3
                  -translate-y-1/2
                  whitespace-nowrap
                  rounded-md
                  bg-slate-900
                  px-3 py-2
                  text-xs font-medium
                  text-white
                  opacity-0
                  shadow-lg
                  transition-opacity duration-200
                  group-hover:opacity-100
                "
              >
                Logout

                <div
                  className="
                    absolute right-full top-1/2
                    -translate-y-1/2
                    border-y-[5px]
                    border-r-[5px]
                    border-y-transparent
                    border-r-slate-900
                  "
                />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}