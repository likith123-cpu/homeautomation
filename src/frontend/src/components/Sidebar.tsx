import {
  Clock,
  Cpu,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  Sofa,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export type Page =
  | "dashboard"
  | "rooms"
  | "devices"
  | "schedules"
  | "energy"
  | "settings";

const NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode }[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  { id: "rooms", label: "Rooms", icon: <Sofa className="w-5 h-5" /> },
  { id: "devices", label: "Devices", icon: <Cpu className="w-5 h-5" /> },
  { id: "schedules", label: "Schedules", icon: <Clock className="w-5 h-5" /> },
  { id: "energy", label: "Energy", icon: <Zap className="w-5 h-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { clear, loginStatus } = useInternetIdentity();

  return (
    <aside className="fixed top-0 left-0 h-full w-[260px] flex flex-col bg-sidebar border-r border-sidebar-border z-30">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-xl bg-homiq-blue flex items-center justify-center shadow-glow">
          <Home className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            HomiQ
          </span>
          <p className="text-xs text-muted-foreground -mt-0.5">Smart Home</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" data-ocid="sidebar.panel">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onNavigate(item.id)}
              data-ocid={`sidebar.${item.id}.link`}
              className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-accent"
                  transition={{
                    duration: 0.2,
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <span
                className={`relative z-10 ${isActive ? "text-homiq-blue" : ""}`}
              >
                {item.icon}
              </span>
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <span className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-homiq-blue" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        {loginStatus === "success" && (
          <button
            type="button"
            onClick={clear}
            data-ocid="sidebar.logout.button"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}
