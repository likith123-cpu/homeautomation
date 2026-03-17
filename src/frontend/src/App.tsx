import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Header } from "./components/Header";
import { type Page, Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { Devices } from "./pages/Devices";
import { Energy } from "./pages/Energy";
import { Rooms } from "./pages/Rooms";
import { Schedules } from "./pages/Schedules";
import { Settings } from "./pages/Settings";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");

  const PAGE_COMPONENTS: Record<Page, React.ReactNode> = {
    dashboard: <Dashboard />,
    rooms: <Rooms />,
    devices: <Devices />,
    schedules: <Schedules />,
    energy: <Energy />,
    settings: <Settings />,
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar currentPage={page} onNavigate={setPage} />

      {/* Main content */}
      <main
        className="flex-1 ml-[260px] min-h-screen overflow-y-auto"
        data-ocid="main.panel"
      >
        <div className="max-w-[960px] mx-auto px-6 py-8">
          <Header />
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {PAGE_COMPONENTS[page]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Toaster richColors position="top-right" />
    </div>
  );
}
