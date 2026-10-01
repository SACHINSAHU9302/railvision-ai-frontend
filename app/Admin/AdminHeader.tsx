"use client";

import { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  UserCircle,
  X,
  ArrowLeft,
} from "lucide-react";

interface AdminHeaderProps {
  setIsSidebarOpen: (value: boolean) => void;
  isSidebarCollapsed: boolean;
}

export default function AdminHeader({
  setIsSidebarOpen,
  isSidebarCollapsed,
}: AdminHeaderProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header
      className="
        sticky top-0 z-30
        flex h-16 w-full items-center
        justify-between
        border-b border-slate-200
        bg-white
        px-4 sm:px-6 lg:px-8
      "
    >
      {/* =====================================
          MOBILE SEARCH MODE
      ====================================== */}
      {isMobileSearchOpen ? (
        <div className="flex w-full items-center gap-2">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => {
              setIsMobileSearchOpen(false);
              setSearchQuery("");
            }}
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-lg
              text-slate-600
              hover:bg-slate-100
            "
            aria-label="Close search"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Mobile Search Input */}
          <div className="relative flex-1">
            <Search
              className="
                absolute left-3 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search..."
              className="
                h-10 w-full
                rounded-lg
                border border-slate-200
                bg-slate-50
                pl-10 pr-10
                text-sm
                text-slate-700
                outline-none
                focus:border-blue-500
                focus:bg-white
                focus:ring-2
                focus:ring-blue-500/10
              "
            />

            {/* Clear Search */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="
                  absolute right-2 top-1/2
                  flex h-7 w-7
                  -translate-y-1/2
                  items-center justify-center
                  rounded-md
                  text-slate-400
                  hover:bg-slate-200
                  hover:text-slate-700
                "
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* =====================================
              LEFT SECTION
          ====================================== */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {/* Mobile Sidebar Button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-lg
                text-slate-600
                transition-colors
                hover:bg-slate-100
                hover:text-slate-900
                lg:hidden
              "
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Desktop Search */}
            <div className="relative hidden sm:block">
              <Search
                className="
                  absolute left-3 top-1/2
                  h-4 w-4
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search..."
                className={`
                  h-10
                  rounded-lg
                  border border-slate-200
                  bg-slate-50
                  pl-10 pr-4
                  text-sm
                  text-slate-700
                  placeholder:text-slate-400
                  outline-none
                  transition-all duration-300
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-2
                  focus:ring-blue-500/10

                  ${
                    isSidebarCollapsed
                      ? "w-96"
                      : "w-56 lg:w-72"
                  }
                `}
              />
            </div>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(true)}
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-lg
                text-slate-500
                transition-colors
                hover:bg-slate-100
                hover:text-slate-900
                sm:hidden
              "
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* =====================================
              RIGHT SECTION
          ====================================== */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            {/* Notification */}
            <button
              type="button"
              className="
                relative
                flex h-10 w-10
                items-center justify-center
                rounded-lg
                text-slate-500
                transition-colors
                hover:bg-slate-100
                hover:text-slate-900
              "
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />

              {/* Notification Badge */}
              <span
                className="
                  absolute right-1.5 top-1.5
                  h-2 w-2
                  rounded-full
                  bg-red-500
                  ring-2 ring-white
                "
              />
            </button>

            {/* Divider */}
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            {/* Admin Profile */}
            <button
              type="button"
              className="
                flex items-center gap-2
                rounded-lg
                p-1.5
                transition-colors
                hover:bg-slate-100
              "
            >
              {/* Profile Text */}
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold leading-5 text-slate-900">
                  Admin User
                </p>

                <p className="text-xs leading-4 text-slate-500">
                  Super Admin
                </p>
              </div>

              {/* Profile Icon */}
              <UserCircle className="h-9 w-9 text-slate-400" />
            </button>
          </div>
        </>
      )}
    </header>
  );
}